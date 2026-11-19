import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7V5.2A2.2 2.2 0 0 1 10.7 3h2.6a2.2 2.2 0 0 1 2.2 2.2V7" />
      <path d="M3 12.5h18" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16.5 5.2a3.5 3.5 0 0 1 0 5.6" />
      <path d="M18 14.6a6.5 6.5 0 0 1 3.5 5.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  chevronRight: <path d="M9 5l7 7-7 7" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  bookmark: <path d="M6 3.5h12a.8.8 0 0 1 .8.9V21l-6.8-4-6.8 4V4.4a.8.8 0 0 1 .8-.9z" />,
  check: <path d="M4.5 12.5l5 5L20 6.5" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  star: (
    <path d="M12 3.6l2.6 5.4 6 .9-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.9l6-.9z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2v5.2l3.4 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M6.3 3.5h3l1.5 4-1.9 1.4a12.5 12.5 0 0 0 6.2 6.2l1.4-1.9 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.3 5.7 2 2 0 0 1 6.3 3.5z" />
  ),
  link: (
    <>
      <path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l1.8-1.8a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
      <path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-1.8 1.8a4.5 4.5 0 0 0 6.4 6.4l1-1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 8.2-8 9.5C7.2 20.2 4 16.5 4 12V6z" />
      <path d="M8.7 12.2l2.3 2.3 4.3-4.5" />
    </>
  ),
  filter: (
    <>
      <path d="M3.5 5.5h17" />
      <path d="M7 12h10" />
      <path d="M10 18.5h4" />
    </>
  ),
  heart: (
    <path d="M12 20.2S4.4 15.6 4.4 10.4A4.2 4.2 0 0 1 12 7.7a4.2 4.2 0 0 1 7.6 2.7c0 5.2-7.6 9.8-7.6 9.8z" />
  ),
  message: <path d="M21 12a8 8 0 0 1-8 8H8.6L4 23v-6.4A8 8 0 0 1 11 3h2a8 8 0 0 1 8 8z" />,
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.6 13.6L7 21l5-2.6L17 21l-1.6-7.4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9.5 7V4.2h5V7" />
      <path d="M6.5 7l1 13h9l1-13" />
    </>
  ),
  send: (
    <>
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3l-6.8 18-3.7-7.5L3 9.8z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.9" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11" />
      <path d="M7.2 10.2L12 15l4.8-4.8" />
      <path d="M4.5 20.5h15" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4.2L20.5 7.7a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L4 15.8z" />
      <path d="M14.5 5.5l4 4" />
    </>
  ),
  play: <path d="M8 5.2l10.5 6.8L8 18.8z" />,
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9.5 9.5" />
      <path d="M18 14v5.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19.5v-11A1.5 1.5 0 0 1 5.5 7H11" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="11" height="18" rx="1.5" />
      <path d="M15 9h4.2a.8.8 0 0 1 .8.8V21" />
      <path d="M7.5 7h4" />
      <path d="M7.5 11h4" />
      <path d="M7.5 15h4" />
      <path d="M3 21h18" />
    </>
  ),
  graduation: (
    <>
      <path d="M2.5 8.5L12 4l9.5 4.5L12 13z" />
      <path d="M6 10.4v4.8c0 1.6 2.7 2.8 6 2.8s6-1.2 6-2.8v-4.8" />
      <path d="M21.5 8.5v5.5" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.7,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[14px] bg-pine text-white"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        className="h-[62%] w-[62%]"
        aria-hidden="true"
      >
        <path d="M4 19v-6.5a8 8 0 0 1 16 0V19" />
        <path d="M8.5 19v-4.2a3.5 3.5 0 0 1 7 0V19" />
        <path d="M2.5 19h19" />
      </svg>
    </span>
  );
}
