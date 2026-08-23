const { Pool } = require('pg');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not defined.');
  process.exit(1);
}

// Render short hostname fallback (e.g., dpg-xxx-a -> dpg-xxx-a.singapore-postgres.render.com)
connectionString = connectionString.replace(/@([a-z0-9-]+)(\/|:|\?|$)/i, (match, host, rest) => {
  if (host.startsWith('dpg-') && !host.includes('.')) {
    const region = process.env.RENDER_REGION || 'singapore';
    return `@${host}.${region}-postgres.render.com${rest}`;
  }
  return match;
});

const isProduction = process.env.NODE_ENV === 'production';
const isRender = !!process.env.RENDER || !!process.env.RENDER_SERVICE_ID;
const hasSslMode = connectionString.includes('sslmode=');

const pool = new Pool({
  connectionString,
  ssl: (isProduction || isRender || hasSslMode) ? { rejectUnauthorized: false } : false,
});

const schema = `
CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_members (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS boards (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('kanban', 'scrum')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sprints (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  sprint_id INTEGER REFERENCES sprints(id),
  board_id INTEGER REFERENCES boards(id),
  assignee_id INTEGER REFERENCES users(id),
  created_by INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'to_do' CHECK (status IN ('to_do', 'in_progress', 'in_review', 'testing', 'done')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  uploaded_by INTEGER NOT NULL REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'in_app')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_settings (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  organization_name VARCHAR(255),
  timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
  working_days JSONB NOT NULL DEFAULT '["Monday","Tuesday","Wednesday","Thursday","Friday"]',
  default_task_priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  theme VARCHAR(20) NOT NULL DEFAULT 'light',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (id, name) VALUES
  (1, 'Super Admin'),
  (2, 'Organization Admin'),
  (3, 'Project Admin'),
  (4, 'Project Manager'),
  (5, 'Team Lead'),
  (6, 'Designer'),
  (7, 'QA Tester'),
  (8, 'Client'),
  (9, 'Viewer')
ON CONFLICT (id) DO NOTHING;

-- Seed default Organization
INSERT INTO organizations (id, name) VALUES
  (1, 'Acme Corp')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('organizations', 'id'),
  COALESCE((SELECT MAX(id) FROM organizations), 1),
  true
);

-- Seed default test users for all 9 roles with distinct passwords
INSERT INTO users (id, organization_id, role_id, name, email, password_hash) VALUES
  (1, 1, 1, 'Super Admin User', 'superadmin@crewpal.com', '$2b$10$G1uQOuA6a.8/kEN2N4oRauEQozjfIlrlITxhLu.BC0ykN5q5iprYO'),
  (2, 1, 2, 'Org Admin User', 'orgadmin@crewpal.com', '$2b$10$pTdPgw0IuRXAZp/du6V.ZOgxvjpMFr5rK/NRvndn6qXBF1WsgyRA6'),
  (3, 1, 3, 'Project Admin User', 'projectadmin@crewpal.com', '$2b$10$klMC1Jlpje20djSZWGA07O5otzQRIlsbH4ANPRa2NPdda7xkjvfnO'),
  (4, 1, 4, 'Project Manager User', 'manager@crewpal.com', '$2b$10$u2gPfSpuqdWOQs1t4JQiq.rqWBouThPeeUgAj3HUYAxZ2ElYAQ/xK'),
  (5, 1, 5, 'Team Lead User', 'teamlead@crewpal.com', '$2b$10$gieeZvkwhBSYWWWU5VV/gO./LMtOcpqeZHNGGsPsoaLo.YN3/BJzi'),
  (6, 1, 6, 'Designer User', 'designer@crewpal.com', '$2b$10$th/GwvSgiwZuYTrOnMCgmu6OY86fA2pDrvi1/nCrbktuTWHzszKkK'),
  (7, 1, 7, 'QA Tester User', 'qa@crewpal.com', '$2b$10$AdY7bqsa3NNrXLA2jHS75.7d2hLslqup2TlnPMEwoPk2qxfqyI/Ji'),
  (8, 1, 8, 'Client User', 'client@crewpal.com', '$2b$10$R2KOYzT01fFdzQOFnKxskeDP.yQps4FTMFF/vHLqqplRyocbzpBh2'),
  (9, 1, 9, 'Viewer User', 'viewer@crewpal.com', '$2b$10$FQ8rIQ56cN5TBfyvgl8Mn.Nl3/dByccwouaztwsxOIKEpC89LIR66')
ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = TRUE;

-- Seed default project, board, sprint, and task
INSERT INTO projects (id, organization_id, name, description, created_by) VALUES
  (1, 1, 'Default Project', 'Initial testing project for WorkTrack', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO project_members (id, project_id, user_id, role_id) VALUES
  (1, 1, 1, 1),
  (2, 1, 2, 2),
  (3, 1, 3, 3),
  (4, 1, 4, 4),
  (5, 1, 5, 5),
  (6, 1, 6, 6),
  (7, 1, 7, 7),
  (8, 1, 8, 8),
  (9, 1, 9, 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO boards (id, project_id, name, type) VALUES
  (1, 1, 'Default Scrum Board', 'scrum')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sprints (id, project_id, name, status) VALUES
  (1, 1, 'Sprint 1', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, project_id, sprint_id, board_id, created_by, title, description, status) VALUES
  (1, 1, 1, 1, 1, 'Initial Setup Task', 'First task for testing comments and attachments', 'to_do')
ON CONFLICT (id) DO NOTHING;
`;

async function initDB(retries = 5, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 [Attempt ${attempt}/${retries}] Initializing PostgreSQL database schema & roles...`);
      await pool.query(schema);
      console.log('✅ Database schema initialized successfully!');
      await pool.end();
      return;
    } catch (err) {
      console.error(`⚠️ Attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt === retries) {
        console.error('❌ Database initialization failed after max retries:', err);
        await pool.end();
        process.exit(1);
      }
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

initDB();
