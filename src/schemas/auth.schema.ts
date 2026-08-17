import { z } from "zod";

// SRM institutional email addresses or BrainMint demo accounts
const ALLOWED_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(srmist\.edu\.in|brainmint\.com)$/;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Mail ID is required")
    .email("Enter a valid email address")
    .regex(ALLOWED_EMAIL_REGEX, "Use your SRM Mail ID or BrainMint credentials"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Mail ID is required")
    .email("Enter a valid email address")
    .regex(ALLOWED_EMAIL_REGEX, "Use your SRM Mail ID or BrainMint credentials"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
