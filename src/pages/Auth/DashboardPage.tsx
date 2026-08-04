import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream text-center">
      <h1 className="text-2xl font-semibold text-forest">You&apos;re in 🎉</h1>
      <p className="text-forest/60">This is a placeholder — build the real dashboard here.</p>
      <Button
        variant="outline"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Log out
      </Button>
    </div>
  );
}
