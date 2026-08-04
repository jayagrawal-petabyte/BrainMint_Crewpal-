import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-forest md:text-3xl">Reset Password</h1>
        <p className="mt-2 text-sm text-forest/60">
          This flow is coming soon. Head back and log in for now.
        </p>
      </div>
      <Button asChild variant="outline" className="w-full">
        <Link to="/login">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </Button>
    </AuthLayout>
  );
}
