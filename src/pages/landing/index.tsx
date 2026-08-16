import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import heroImage from "../../assets/hero.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-cream-100 text-forest-900 flex flex-col">
      <header className="sticky top-0 z-20 bg-cream-100/90 backdrop-blur border-b border-cream-200">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            to="/landing"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Crewpal home"
          >
            <span className="w-9 h-9 rounded-xl bg-forest-800 text-cream-50 flex items-center justify-center font-bold text-lg shadow-sm">
              CP
            </span>
            <span className="font-extrabold text-lg tracking-wide leading-none">
              CREWPAL
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-forest-800 text-forest-800 bg-cream-50 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-forest-800 hover:text-cream-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 active:translate-y-px cursor-pointer"
            >
              Contact Us
            </a>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-forest-800 text-cream-50 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold border border-forest-800 shadow-sm transition-all duration-200 hover:bg-forest-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 active:bg-forest-900 active:translate-y-px active:shadow-inner"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-24 text-center">
          <span className="inline-block bg-olive-200 text-forest-800 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
            BrainMint WorkTrack
          </span>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-forest-900">
            CREWPAL
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-forest-600">
            Your project management portal — plan, track, and deliver tasks, sprints, and
            reports with your team in one calm, focused workspace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-forest-800 text-cream-50 px-8 py-3.5 text-base font-semibold border border-forest-800 shadow-sm transition-all duration-200 hover:bg-forest-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 active:translate-y-px cursor-pointer"
            >
              Get Started
            </Link>

            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-forest-800 text-forest-800 bg-cream-50 px-8 py-3.5 text-base font-semibold transition-all duration-200 hover:bg-forest-800 hover:text-cream-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 active:translate-y-px cursor-pointer"
            >
              Contact Us
            </a>
          </div>

          <div className="mt-14 flex justify-center">
            <img
              src={heroImage}
              alt="Crewpal project management dashboard"
              className="w-full max-w-md sm:max-w-lg rounded-2xl shadow-lg border border-cream-200 bg-white"
            />
          </div>
        </section>

        <section id="contact" className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-20 scroll-mt-24">
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8 sm:p-10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-forest-900">Contact Us</h2>
            <p className="mt-2 text-sm text-forest-600">
              Questions or feedback about Crewpal? Our team is happy to help.
            </p>
            <a
              href="mailto:hello@crewpal.app"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-forest-800 text-forest-800 bg-cream-50 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:bg-forest-800 hover:text-cream-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 active:translate-y-px cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              hello@crewpal.app
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-cream-200 bg-cream-50">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-forest-500">
          <p>&copy; {new Date().getFullYear()} Crewpal. All rights reserved.</p>
          <p>BrainMint WorkTrack</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
