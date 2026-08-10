import { z } from "zod";

// SRM institutional email addresses (e.g. abc123@srmist.edu.in)
const SRM_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "SRM Mail ID is required")
    .email("Enter a valid email address")
    .regex(SRM_EMAIL_REGEX, "Use your SRM Mail ID (e.g. name@srmist.edu.in)"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "SRM Mail ID is required")
    .email("Enter a valid email address")
    .regex(SRM_EMAIL_REGEX, "Use your SRM Mail ID (e.g. name@srmist.edu.in)"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
