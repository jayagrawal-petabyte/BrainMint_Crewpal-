export function AuthDecoration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute -left-24 -top-24 h-72 w-72 animate-float text-forest-light/25"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M45.3,-58.5C58.5,-49.8,68.5,-34.9,71.9,-18.5C75.3,-2.1,72,15.8,63.2,30.5C54.4,45.2,40,56.6,23.7,63.5C7.3,70.4,-11,72.8,-27.6,67.6C-44.2,62.4,-59,49.6,-66.8,33.5C-74.6,17.4,-75.4,-2,-69.6,-18.7C-63.8,-35.4,-51.4,-49.4,-37,-58.1C-22.6,-66.8,-11.3,-70.2,3.4,-75.2C18.1,-80.2,32.1,-67.2,45.3,-58.5Z" transform="translate(100 100)" />
      </svg>

      <svg
        className="absolute -bottom-32 -right-20 h-96 w-96 text-tag-tasks-bg/20"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M39.5,-51.6C50.9,-43.2,59.5,-30.4,63.6,-15.9C67.7,-1.4,67.3,14.8,60.4,28.2C53.5,41.6,40.1,52.2,25.2,58.6C10.3,65,-6.1,67.2,-21.6,63.3C-37.1,59.4,-51.7,49.4,-60.6,35.5C-69.5,21.6,-72.7,3.8,-69.1,-12.3C-65.5,-28.4,-55.1,-42.8,-41.6,-51.2C-28.1,-59.6,-14.1,-62,0.9,-63.2C15.8,-64.4,28.1,-60,39.5,-51.6Z" transform="translate(100 100)" />
      </svg>

      <svg
        className="absolute right-10 top-10 h-40 w-40 text-tag-projects-bg/25"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <circle cx="100" cy="100" r="90" />
      </svg>

      <svg
        className="absolute bottom-16 left-10 h-24 w-24 text-tag-interns-bg/25"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <rect x="20" y="20" width="160" height="160" rx="40" />
      </svg>
    </div>
  );
}
