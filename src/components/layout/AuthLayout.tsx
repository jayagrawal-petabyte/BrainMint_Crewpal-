import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { AuthDecoration } from "@/components/illustrations/AuthDecoration";
import { Card } from "@/components/ui/Card";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-dark px-4 py-10">
      <AuthDecoration />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <Logo size="lg" className="text-cream text-3xl md:text-4xl" />
        </div>
        <Card className="p-8 md:p-10">{children}</Card>
      </motion.div>
    </div>
  );
}
