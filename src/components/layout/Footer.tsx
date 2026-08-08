import { Link } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="w-full border-t border-forest/10 bg-cream-50"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-center md:flex-row md:justify-between md:px-10 md:text-left">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <Logo size="sm" />

          <p className="text-xs font-medium tracking-wide text-forest-500">
            BrainMint WorkTrack
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <Link
            to="/login"
            className="rounded-sm text-sm font-medium text-forest/70 transition-colors hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30"
          >
            Login
          </Link>
        </nav>

        <p className="text-xs text-forest-500">
          &copy; {currentYear} Crewpal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;