import { z } from "zod";

// SRM institutional email addresses or CrewPal emails
const ALLOWED_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(srmist\.edu\.in|brainmint\.com|crewpal\.com)$/i;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Mail ID is required")
    .email("Enter a valid email address")
    .regex(ALLOWED_EMAIL_REGEX, "Use your valid CrewPal or SRM email"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Mail ID is required")
    .email("Enter a valid email address")
    .regex(ALLOWED_EMAIL_REGEX, "Use your valid CrewPal or SRM email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
