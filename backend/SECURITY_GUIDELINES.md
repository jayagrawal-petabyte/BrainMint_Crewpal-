# BrainMint CrewPal — Secure Coding Guidelines & PR Review Checklist

---

## Table of Contents

1. [Authentication & JWT](#1-authentication--jwt)
2. [Authorization & RBAC](#2-authorization--rbac)
3. [IDOR Prevention & Org-Scoping](#3-idor-prevention--org-scoping)
4. [Input Validation](#4-input-validation)
5. [SQL Injection Prevention](#5-sql-injection-prevention)
6. [XSS Prevention](#6-xss-prevention)
7. [File Upload Security](#7-file-upload-security)
8. [Error Handling & Information Disclosure](#8-error-handling--information-disclosure)
9. [Audit Logging](#9-audit-logging)
10. [PR Review Checklist](#10-pr-review-checklist)

---

## 1. Authentication & JWT

### Requirements

- **Every endpoint** (except `POST /auth/login`) MUST have `@UseGuards(JwtAuthGuard)` either at the controller or handler level.
- JWT tokens MUST have a finite expiration (`ignoreExpiration: false`).
- `JWT_SECRET` MUST be at least 32 characters of cryptographic randomness. Never use default placeholder values.
- The JWT strategy (`JwtStrategy.validate()`) MUST re-verify the user's `is_active` status on every request.

### Anti-Patterns

```typescript
// ❌ BAD — No auth guard
@Get('public-data')
getData() { ... }

// ✅ GOOD — Explicit guard
@Get('public-data')
@UseGuards(JwtAuthGuard)
getData() { ... }

// ✅ BEST — Guard at controller level
@Controller('data')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DataController { ... }
```

---

## 2. Authorization & RBAC

### The 9 Roles

| ID | Role | Scope |
|----|------|-------|
| 1 | SUPER_ADMIN | Cross-org, full access |
| 2 | ORG_ADMIN | All resources within their org |
| 3 | PROJECT_ADMIN | Projects they are members of |
| 4 | PROJECT_MANAGER | Projects they are members of |
| 5 | TEAM_LEAD | Projects they are members of |
| 6 | DESIGNER | Projects they are members of |
| 7 | QA_TESTER | Projects they are members of |
| 8 | CLIENT | Projects they are members of (limited write) |
| 9 | VIEWER | Read-only on projects they are members of |

### Requirements

- **Every controller** MUST use `@UseGuards(JwtAuthGuard, RolesGuard)` at the class level.
- **Every mutating endpoint** (POST, PATCH, PUT, DELETE) MUST have an explicit `@Roles()` decorator.
- **VIEWER (role 9)** MUST be excluded from all mutating `@Roles()` decorators.
- **Do NOT** rely solely on service-layer `if` checks for role enforcement — always use `@Roles()` as the primary gate.
- Service-layer checks provide defense-in-depth but are NOT a substitute for guard-level enforcement.

### Anti-Patterns

```typescript
// ❌ BAD — No @Roles(), relies on service check
@Post()
create(@Body() dto: CreateDto, @Req() req: any) {
  if (req.user.role_id === Role.VIEWER) throw new ForbiddenException();
  return this.service.create(dto, req.user);
}

// ✅ GOOD — Explicit @Roles() + service check as backup
@Post()
@Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN, ...)  // VIEWER excluded
create(@Body() dto: CreateDto, @Req() req: any) {
  return this.service.create(dto, req.user);
}
```

### Privilege Escalation Prevention

- **ORG_ADMIN cannot assign SUPER_ADMIN role** — enforce in service layer.
- **Role ID validation**: Always check `@IsEnum(Role)` or `@Min(1) @Max(9)` in DTOs.
- **Role hierarchy comparisons** (`user.role_id > Role.PROJECT_MANAGER`): Remember lower IDs = higher privilege.

---

## 3. IDOR Prevention & Org-Scoping

### The Three-Layer Access Pattern

Every data-access method MUST implement these checks in order:

```
1. Resource exists?           → NotFoundException if not
2. Same organization?         → NotFoundException (NOT ForbiddenException)
3. Project membership?        → ForbiddenException if not member (roles 3-9)
```

### Why NotFoundException for cross-org?

Returning `ForbiddenException` to a cross-tenant user confirms the resource exists. Use `NotFoundException` to avoid information disclosure.

### Standard Template

```typescript
private async verifyTaskAccess(taskId: number, user: AuthenticatedUser) {
  const result = await this.db.query(
    `SELECT t.id, t.project_id, p.organization_id,
            (pm.user_id IS NOT NULL) AS is_member
     FROM tasks t
     JOIN projects p ON p.id = t.project_id
     LEFT JOIN project_members pm ON pm.project_id = t.project_id AND pm.user_id = $1
     WHERE t.id = $2`,
    [user.id, taskId],
  );

  if (result.rows.length === 0) {
    throw new NotFoundException('Resource not found');
  }

  const info = result.rows[0];

  // 1. Super Admin bypasses all checks
  if (user.role_id === Role.SUPER_ADMIN) return info;

  // 2. Org isolation (use NotFoundException, not ForbiddenException)
  if (info.organization_id !== user.organization_id) {
    throw new NotFoundException('Resource not found');
  }

  // 3. Org Admin has org-wide access
  if (user.role_id === Role.ORG_ADMIN) return info;

  // 4. Roles 3-9 need project membership
  if (!info.is_member) {
    throw new ForbiddenException('Access denied: Not a project member');
  }

  return info;
}
```

### Checklist

- [ ] Every `findOne()`, `update()`, `delete()` checks resource ownership
- [ ] Cross-org access returns `NotFoundException`
- [ ] Project-level resources check `project_members` table
- [ ] User IDs come from `req.user` (JWT), never from request body/params for auth decisions
- [ ] `ParseIntPipe` used on all `:id` route params

---

## 4. Input Validation

### Requirements

- **Every endpoint** MUST use a DTO class with `class-validator` decorators.
- **Never** use raw `@Body('fieldName')` extraction — always use a full DTO class.
- The global `ValidationPipe` is configured with:
  - `whitelist: true` — strips undeclared properties
  - `forbidNonWhitelisted: true` — rejects payloads with undeclared properties
  - `transform: true` — auto-transforms types

### Mandatory Validators by Field Type

| Field Type | Required Decorators |
|-----------|-------------------|
| String | `@IsString()`, `@MaxLength(N)` |
| Required string | `@IsString()`, `@IsNotEmpty()`, `@MaxLength(N)` |
| Email | `@IsEmail()` |
| Integer ID | `@IsInt()`, `@Min(1)` |
| Enum | `@IsEnum(EnumType)` |
| Boolean | `@IsBoolean()` |
| Optional | `@IsOptional()` before other decorators |
| Password | `@MinLength(8)`, `@Matches(complexity_regex)` |
| Long text | `@IsString()`, `@MaxLength(10000)` |

### Anti-Patterns

```typescript
// ❌ BAD — No DTO, raw body extraction
@Patch(':id/status')
updateStatus(@Body('status') status: string) { ... }

// ✅ GOOD — Dedicated DTO with enum validation
@Patch(':id/status')
updateStatus(@Body() dto: UpdateTaskStatusDto) { ... }

// ❌ BAD — No MaxLength on text fields
@IsOptional()
@IsString()
description?: string;

// ✅ GOOD — Bounded text
@IsOptional()
@IsString()
@MaxLength(10000)
description?: string;
```

---

## 5. SQL Injection Prevention

### Requirements

- **ALWAYS** use parameterized queries with `$1, $2, ...` placeholders.
- **NEVER** concatenate user input into SQL strings.
- Dynamic query builders (e.g., search filters) MUST use parameterized `$N` patterns.

### Safe Dynamic Query Pattern

```typescript
const clauses: string[] = [];
const params: any[] = [];
let idx = 1;

if (filters.status) {
  clauses.push(`status = $${idx++}`);
  params.push(filters.status);
}

if (filters.search) {
  clauses.push(`name ILIKE $${idx++}`);
  params.push(`%${filters.search}%`);  // Safe: value goes through parameterization
}

const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
const result = await this.pool.query(`SELECT * FROM items ${where}`, params);
```

### Anti-Patterns

```typescript
// ❌ CRITICAL — String interpolation in SQL
const result = await this.pool.query(
  `SELECT * FROM users WHERE email = '${dto.email}'`
);

// ❌ BAD — Template literal for column/table names from user input
const result = await this.pool.query(
  `SELECT * FROM ${tableName} WHERE id = $1`, [id]
);

// ✅ GOOD — Parameterized query
const result = await this.pool.query(
  'SELECT * FROM users WHERE email = $1', [dto.email]
);
```

---

## 6. XSS Prevention

### Backend

- The global `SanitizeHtmlPipe` strips ALL HTML tags from request bodies.
- It runs BEFORE `ValidationPipe` in the pipe chain.
- Configuration: `allowedTags: []`, `allowedAttributes: {}`, `disallowedTagsMode: 'recursiveEscape'`.

### Frontend (when built)

- **NEVER** use `dangerouslySetInnerHTML` or equivalent.
- Use framework-native rendering (React `{}`, Angular `{{ }}`) which auto-escapes.
- All user-generated content (comments, task descriptions, usernames) MUST be treated as untrusted.
- If rich text is needed, use a sanitization library (e.g., DOMPurify) with an explicit allowlist.

### Headers

- `helmet` middleware is applied globally, providing:
  - `Content-Security-Policy`
  - `X-XSS-Protection`
  - `X-Content-Type-Options: nosniff`

---

## 7. File Upload Security

### Requirements (8-Point Checklist)

1. ✅ **File size limit**: Enforce at both Multer (`limits.fileSize`) and service layer
2. ✅ **MIME type allowlist**: Only permit known-safe MIME types
3. ✅ **Extension allowlist**: Validate file extension against an allowlist
4. ✅ **Magic-byte validation**: Verify file content matches claimed type using `file-type`
5. ✅ **Filename sanitization**: Use `path.basename()` + regex to strip dangerous chars
6. ✅ **UUID prefix**: All stored files get `randomUUID()-sanitizedName` filenames
7. ✅ **Path traversal**: `path.basename()` prevents `../../` attacks
8. ✅ **Auth + IDOR**: Verify user can access the task before upload/download

### Serving Files Safely

```typescript
// When serving uploaded files:
res.setHeader('Content-Disposition', 'attachment; filename="..."');
res.setHeader('X-Content-Type-Options', 'nosniff');
// Never serve user-uploaded HTML/SVG inline
```

### Disallowed File Types

Never allow: `.exe`, `.bat`, `.cmd`, `.sh`, `.js`, `.html`, `.svg`, `.php`, `.jsp`, `.asp`

---

## 8. Error Handling & Information Disclosure

### Rules

- **Cross-tenant access**: Return `NotFoundException`, not `ForbiddenException`
- **Login failures**: Return generic "Invalid credentials" — never disclose whether the email exists
- **Stack traces**: Never expose in production (NestJS hides them by default in production mode)
- **Database errors**: Catch and return generic error messages — never expose SQL error details
- **Validation errors**: `class-validator` errors are safe to return (they describe the DTO contract)

---

## 9. Audit Logging

### What to Log

- All authentication events (login, logout, failed attempts)
- All mutating operations (POST, PUT, PATCH, DELETE)
- Authorization failures (role denials, IDOR attempts)
- File uploads and deletions

### What to REDACT

- Passwords and password hashes
- JWT tokens
- API keys or secrets

### Implementation

- Use the `AuditLogInterceptor` for automatic logging of mutating requests.
- Use `AuditLogsService.recordSafely()` for manual logging (never throws).
- The interceptor automatically redacts fields in `SENSITIVE_FIELDS` set.

---

## 10. PR Review Checklist

Copy this checklist into every PR that touches auth, RBAC, or data access:

```markdown
### Security Review Checklist

#### Authentication
- [ ] All new endpoints have `@UseGuards(JwtAuthGuard)` (or inherit from controller)
- [ ] No endpoints exposed without authentication (unless intentionally public)

#### Authorization (RBAC)
- [ ] `RolesGuard` is on the controller class
- [ ] Every mutating endpoint has explicit `@Roles()` decorator
- [ ] VIEWER (role 9) is excluded from all write operations
- [ ] Role escalation is prevented (non-SA cannot assign SA role)

#### IDOR / Org-Scoping
- [ ] Every endpoint accessing a resource by ID verifies org membership
- [ ] Cross-tenant access returns NotFoundException (not ForbiddenException)
- [ ] Project-level resources check `project_members` for roles 3-9
- [ ] User ID for auth decisions comes from `req.user`, never from request body

#### Input Validation
- [ ] All endpoints use DTO classes with class-validator decorators
- [ ] No raw `@Body('fieldName')` extraction — full DTO classes only
- [ ] String fields have `@MaxLength()` constraints
- [ ] Enum fields use `@IsEnum()` 
- [ ] Integer IDs use `@IsInt()` and `@Min(1)`

#### SQL
- [ ] All queries use parameterized `$N` placeholders
- [ ] No string concatenation of user input into SQL

#### XSS
- [ ] User-generated content is not rendered with `dangerouslySetInnerHTML`
- [ ] Rich text (if any) uses DOMPurify or equivalent

#### File Uploads (if applicable)
- [ ] File size limit enforced
- [ ] MIME type + extension + magic-byte validation
- [ ] Filename sanitized (path.basename + regex)
- [ ] UUID-prefixed storage names
- [ ] Auth + IDOR check before upload

#### General
- [ ] No sensitive data (passwords, tokens) in logs or error messages
- [ ] Error messages don't disclose system internals
- [ ] `req.user` is properly typed (not `any`)
```

---

## Appendix: Projects Controller Security Regression

> **⚠️ WARNING**: The latest pull (commit `70d21a6`) removed `RolesGuard` and all `@Roles()` decorators from `projects.controller.ts`. Additionally, `DELETE /projects/:id` no longer passes `req.user` to the service, bypassing org-scoping.
>
> This MUST be restored. See the original implementation for reference, or apply the standard pattern from Section 2.
