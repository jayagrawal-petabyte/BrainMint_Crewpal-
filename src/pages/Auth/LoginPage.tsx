import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, status, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const isLoading = status === "loading";

  const onSubmit = async (values: LoginFormValues) => {
    clearError();
    try {
      await login({ ...values, rememberMe: values.rememberMe ?? false });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 900);
    } catch {
      // error state is already set in the store; nothing else to do here.
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-forest md:text-3xl">Welcome Back</h1>
        <p className="mt-2 text-sm text-forest/60">Please log in to continue.</p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-10 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-tag-tasks-text" />
            <p className="font-medium text-forest">Logged in successfully</p>
            <p className="text-sm text-forest/60">Taking you to your dashboard&hellip;</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
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

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              trailingAction={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-forest/40 transition-colors hover:text-forest"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              {...register("password")}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-forest/70">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                Remember Me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-forest hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" isLoading={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
