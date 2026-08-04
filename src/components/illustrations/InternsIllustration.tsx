import { motion } from "framer-motion";

/**
 * Hand-authored flat-style SVG scene: three collaborators around a shared
 * task board, rendered entirely in the Crewpal palette. No external assets.
 */
export function InternsIllustration({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 480 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      {/* backdrop blob */}
      <ellipse cx="240" cy="270" rx="190" ry="26" fill="#173A2A" fillOpacity="0.06" />

      {/* shared table */}
      <rect x="90" y="200" width="300" height="16" rx="8" fill="#173A2A" fillOpacity="0.12" />
      <rect x="110" y="216" width="14" height="46" rx="4" fill="#173A2A" fillOpacity="0.12" />
      <rect x="356" y="216" width="14" height="46" rx="4" fill="#173A2A" fillOpacity="0.12" />

      {/* task board on table */}
      <rect x="176" y="150" width="128" height="60" rx="10" fill="#FDF7E6" stroke="#173A2A" strokeOpacity="0.2" strokeWidth="2" />
      <rect x="188" y="162" width="30" height="8" rx="4" fill="#D9EEE1" />
      <rect x="188" y="176" width="46" height="8" rx="4" fill="#FDE9C8" />
      <rect x="188" y="190" width="24" height="8" rx="4" fill="#E3E1F7" />
      <rect x="228" y="162" width="60" height="8" rx="4" fill="#173A2A" fillOpacity="0.15" />
      <rect x="242" y="176" width="46" height="8" rx="4" fill="#173A2A" fillOpacity="0.1" />
      <rect x="220" y="190" width="60" height="8" rx="4" fill="#173A2A" fillOpacity="0.15" />

      {/* left collaborator */}
      <g>
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="128" cy="128" r="24" fill="#FDE9C8" />
          <circle cx="128" cy="122" r="12" fill="#173A2A" fillOpacity="0.85" />
          <path d="M104 172c2-20 12-30 24-30s22 10 24 30" fill="#2A5540" />
        </motion.g>
      </g>

      {/* center collaborator (standing, presenting) */}
      <g>
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <circle cx="240" cy="108" r="26" fill="#D9EEE1" />
          <circle cx="240" cy="102" r="13" fill="#173A2A" fillOpacity="0.85" />
          <path d="M214 168c2-24 13-34 26-34s24 10 26 34" fill="#173A2A" />
        </motion.g>
      </g>

      {/* right collaborator */}
      <g>
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          <circle cx="352" cy="128" r="24" fill="#E3E1F7" />
          <circle cx="352" cy="122" r="12" fill="#173A2A" fillOpacity="0.85" />
          <path d="M328 172c2-20 12-30 24-30s22 10 24 30" fill="#2A5540" />
        </motion.g>
      </g>

      {/* floating task chips */}
      <motion.g
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="60" y="70" width="56" height="20" rx="10" fill="#FDE9C8" />
        <text x="70" y="84" fontSize="10" fontFamily="Inter, sans-serif" fill="#8A5A11" fontWeight="600">
          Intern
        </text>
      </motion.g>
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <rect x="360" y="60" width="56" height="20" rx="10" fill="#D9EEE1" />
        <text x="370" y="74" fontSize="10" fontFamily="Inter, sans-serif" fill="#1F6B44" fontWeight="600">
          Task
        </text>
      </motion.g>
      <motion.g
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <rect x="196" y="40" width="72" height="20" rx="10" fill="#E3E1F7" />
        <text x="206" y="54" fontSize="10" fontFamily="Inter, sans-serif" fill="#4B3FA3" fontWeight="600">
          Project
        </text>
      </motion.g>
    </motion.svg>
  );
}
