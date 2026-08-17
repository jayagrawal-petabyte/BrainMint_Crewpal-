import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, MailCheck, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth.schema";
import { useAuthStore } from "@/store/authStore";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset, resetStatus, resetError, clearResetError } = useAuthStore();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const isLoading = resetStatus === "loading";

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    clearResetError();
    try {
      await requestPasswordReset(values.email);
      setSentTo(values.email);
    } catch {
      // resetError is already set in the store
    }
  };

  const handleResend = async () => {
    const email = getValues("email");
    clearResetError();
    try {
      await requestPasswordReset(email);
    } catch {
      // resetError is already set in the store
    }
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {sentTo ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <MailCheck className="h-12 w-12 text-tag-tasks-text" />
            <h1 className="text-2xl font-semibold text-forest">Check your inbox</h1>
            <p className="max-w-xs text-sm text-forest/60">
              If an account exists for <span className="font-medium text-forest">{sentTo}</span>,
              a reset link is on its way.
            </p>

            {resetError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-600"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              isLoading={isLoading}
              className="mt-1"
            >
              {isLoading ? "Resending..." : "Resend link"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-forest md:text-3xl">
                Forgot Password
              </h1>
              <p className="mt-2 text-sm text-forest/60">
                Enter your SRM Mail ID and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {resetError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              <Input
                label="SRM Mail ID"
                type="email"
                placeholder="yourname@srmist.edu.in"
                autoComplete="email"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
