import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, ListChecks, FolderKanban } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Logo } from "@/components/layout/Logo";
import { InternsIllustration } from "@/components/illustrations/InternsIllustration";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-6 text-center md:pt-10">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-sm font-medium tracking-wide text-forest/60"
        >
          Welcome to
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.08}>
          <Logo size="lg" className="mt-1" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.16}
          className="mt-4 w-full max-w-md"
        >
          <InternsIllustration className="w-full" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.24}
          className="mt-6 text-3xl font-semibold leading-tight text-forest md:text-5xl"
        >
          BrainMint&apos;s own{" "}
          <Tag variant="interns" icon={<Users className="h-4 w-4 md:h-6 md:w-6" />} className="text-3xl md:text-5xl">
            Interns
          </Tag>{" "}
          &amp;{" "}
          <Tag variant="tasks" icon={<ListChecks className="h-4 w-4 md:h-6 md:w-6" />} className="text-3xl md:text-5xl">
            Tasks
          </Tag>
          <br className="hidden md:block" />{" "}
          <Tag
            variant="projects"
            icon={<FolderKanban className="h-4 w-4 md:h-6 md:w-6" />}
            className="text-3xl md:text-5xl"
          >
            Project
          </Tag>{" "}
          Management Portal
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.32}
          className="mt-4 max-w-lg text-base text-forest/60 md:text-lg"
        >
          Helping interns and managers collaborate together.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.4} className="mt-8">
          <Button size="lg" onClick={() => navigate("/login")} className="min-w-[200px]">
            Login
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
