import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Users, ListChecks, FolderKanban, Mail, Linkedin, MapPin } from "lucide-react";
import { InternsIllustration } from "@/components/illustrations/InternsIllustration";

const MENU_ITEMS = [
  { label: "Interns",    icon: Users,        href: "#interns",  action: null },
  { label: "Tasks",      icon: ListChecks,   href: "#tasks",    action: null },
  { label: "Projects",   icon: FolderKanban, href: "#projects", action: null },
  { label: "Contact Us", icon: Mail,         href: null,        action: "contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const, delay },
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = () => {
    setMenuOpen(false);
    setContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">

      {/* ── Contact Us Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {contactOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setContactOpen(false)}
              className="fixed inset-0 z-40 bg-forest-900/40 backdrop-blur-sm"
            />

            {/* Modal panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto"
            >
              <div className="bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
                {/* Header bar */}
                <div className="bg-forest-800 px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-cream-100" />
                    </span>
                    <div>
                      <p className="text-cream-100 text-lg font-bold font-['Roboto'] leading-tight">Contact Us</p>
                      <p className="text-forest-300 text-xs font-normal">We'd love to hear from you</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setContactOpen(false)}
                    className="w-9 h-9 rounded-full bg-forest-700 hover:bg-forest-600 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-cream-100" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 flex flex-col gap-4">
                  <p className="text-forest-600 text-sm leading-relaxed">
                    Have questions about Crewpal? Reach out to the BrainMint team — we're happy to help interns and managers get started.
                  </p>

                  {/* Contact rows */}
                  <div className="flex flex-col gap-3">
                    {/* Email */}
                    <a
                      href="mailto:brainmintacademy@gmail.com"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-cream-200 transition-colors group"
                    >
                      <span className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-cream-100" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-forest-500 font-medium uppercase tracking-widest">Email</p>
                        <p className="text-forest-800 text-sm font-semibold truncate">brainmintacademy@gmail.com</p>
                      </div>
                      <span className="ml-auto text-forest-400 group-hover:translate-x-1 transition-transform shrink-0">→</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/company/braimint-chennai/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-cream-200 transition-colors group"
                    >
                      <span className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center shrink-0">
                        <Linkedin className="w-4 h-4 text-cream-100" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-forest-500 font-medium uppercase tracking-widest">LinkedIn</p>
                        <p className="text-forest-800 text-sm font-semibold">BrainMint</p>
                      </div>
                      <span className="ml-auto text-forest-400 group-hover:translate-x-1 transition-transform shrink-0">→</span>
                    </a>

                    {/* Address */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-cream-100 border border-cream-200">
                      <span className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-cream-100" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-forest-500 font-medium uppercase tracking-widest">Office</p>
                        <p className="text-forest-800 text-sm font-semibold leading-snug">Chennai, Tamil Nadu</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="mailto:brainmintacademy@gmail.com"
                    className="mt-1 w-full flex items-center justify-center gap-2 bg-forest-800 text-cream-100 rounded-full py-3.5 text-sm font-semibold hover:bg-forest-700 transition-colors shadow-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Send us a message
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="w-full px-8 pt-5 pb-2 flex flex-col">
        <div className="flex items-center justify-between">
          {/* Left: Menu pill + CREWPAL logo */}
          <div className="flex items-center gap-4">
            {/* Menu button */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(v => !v)}
              className="h-12 pl-5 pr-6 bg-forest-700 rounded-[35px] border-b border-olive-500 inline-flex items-center gap-3 hover:bg-forest-600 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X className="w-5 h-5 text-cream-100" />
                  </motion.span>
                ) : (
                  <motion.div key="bars" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col justify-center items-start gap-[5px]">
                    <span className="block w-5 h-[3px] bg-cream-100 rounded-sm" />
                    <span className="block w-5 h-[3px] bg-cream-100 rounded-sm" />
                    <span className="block w-5 h-[3px] bg-cream-100 rounded-sm" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="text-cream-100 text-base font-semibold font-['Roboto'] tracking-wide">Menu</span>
            </button>

            {/* CREWPAL logo */}
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className="flex flex-col justify-center items-start leading-tight">
                <span className="text-forest-800 text-xl font-bold font-['Roboto'] leading-6 tracking-widest">CREWPAL</span>
                <span className="text-forest-500 text-xs font-normal font-['Roboto'] leading-4">for BrainMint Intern</span>
              </div>
            </div>
          </div>

          {/* Right: Contact + Login */}
          <div className="flex items-center gap-3">
            <button
              onClick={openContact}
              className="h-11 px-5 border border-forest-800 text-forest-800 rounded-full text-sm font-semibold hover:bg-forest-800 hover:text-cream-100 transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate("/login")}
              className="h-11 px-5 bg-forest-800 text-cream-100 rounded-full text-sm font-semibold hover:bg-forest-700 transition-colors"
            >
              Log in
            </button>
          </div>
        </div>

        {/* ── Dropdown menu ─────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              key="menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mt-3 mx-2 bg-forest-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <ul className="flex flex-col divide-y divide-forest-700">
                {MENU_ITEMS.map(({ label, icon: Icon, href, action }) => (
                  <li key={label}>
                    {action === "contact" ? (
                      <button
                        onClick={openContact}
                        className="w-full flex items-center gap-4 px-6 py-4 text-cream-100 hover:bg-forest-700 transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-xl bg-forest-700 group-hover:bg-forest-600 flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4 text-cream-200" />
                        </span>
                        <span className="text-base font-medium font-['Roboto'] tracking-wide">{label}</span>
                        <span className="ml-auto text-forest-400 group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    ) : (
                      <a
                        href={href!}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-4 px-6 py-4 text-cream-100 hover:bg-forest-700 transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-xl bg-forest-700 group-hover:bg-forest-600 flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4 text-cream-200" />
                        </span>
                        <span className="text-base font-medium font-['Roboto'] tracking-wide">{label}</span>
                        <span className="ml-auto text-forest-400 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-16 pt-2">
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0} className="text-base font-medium text-teal-600" style={{ fontFamily: "'Inter', sans-serif" }}>
          Welcome to
        </motion.p>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={0.08}
          className="text-[80px] sm:text-[96px] md:text-[120px] font-black italic tracking-tight leading-none text-forest-800"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          CREWPAL
        </motion.h1>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.16} className="w-full max-w-sm sm:max-w-md mt-4">
          <InternsIllustration className="w-full" />
        </motion.div>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={0.26}
          className="mt-6 text-2xl sm:text-3xl font-black text-forest-900 leading-snug max-w-lg"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          BrainMint's own{" "}
          <span className="inline-flex items-center gap-1"><span className="underline decoration-2 underline-offset-2">Interns</span></span>{" "}
          <span className="inline-flex items-center gap-1"><span className="underline decoration-2 underline-offset-2">Tasks</span></span>
          <br />
          <span>&amp;</span>{" "}
          <span className="inline-flex items-center gap-1"><span className="underline decoration-2 underline-offset-2">projects</span></span>{" "}
          <span className="underline decoration-2 underline-offset-2">managing portal</span>
        </motion.p>

        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.34} className="mt-3 text-sm sm:text-base text-forest-600 max-w-sm">
          Helping Interns &amp; Managers connect together
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.42} className="mt-8">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 bg-forest-800 text-cream-100 rounded-full px-8 py-3 text-base font-semibold hover:bg-forest-700 active:bg-forest-900 transition-colors shadow-sm"
          >
            Log in
            <span className="text-lg">→</span>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
