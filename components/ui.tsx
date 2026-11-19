"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";

/* ---------------------------------- text ---------------------------------- */

export function PageHeader({
  title,
  eyebrow,
  back,
  action,
}: {
  title: string;
  eyebrow?: string;
  back?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 bg-paper/95 px-5 pt-4 pb-3 backdrop-blur">
      <div className="flex items-center gap-3">
        {back ? (
          <Link
            href={back}
            aria-label="Go back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-card text-ink"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="truncate font-display text-[26px] leading-tight text-ink">
            {title}
          </h1>
        </div>
        {action}
      </div>
    </header>
  );
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="font-display text-[19px] leading-snug text-ink">{title}</h2>
      {action}
    </div>
  );
}

/* --------------------------------- layout --------------------------------- */

export function Card({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "button";
}) {
  const styles = `rounded-[20px] border border-line bg-card ${className}`;
  if (as === "button") {
    return <button className={`text-left ${styles}`}>{children}</button>;
  }
  return <div className={styles}>{children}</div>;
}

export function Avatar({
  name,
  color,
  size = 44,
  className = "",
}: {
  name: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const parts = name.split(" ").filter(Boolean);
  const text =
    parts.length === 0
      ? "?"
      : parts
          .slice(0, 2)
          .map((part) => part[0].toUpperCase())
          .join("");

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.round(size * 0.34),
      }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}

export function Progress({
  value,
  className = "h-1.5",
  tone = "bg-pine",
}: {
  value: number;
  className?: string;
  tone?: string;
}) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-line ${className}`}>
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${tone}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* --------------------------------- controls -------------------------------- */

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline" | "quiet" | "amber";
  size?: "sm" | "md";
  full?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: IconName;
  className?: string;
};

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  full = false,
  disabled = false,
  type = "button",
  icon,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40";
  const sizes = size === "sm" ? "px-4 py-2 text-[13px]" : "px-5 py-3 text-sm";
  const variants = {
    primary: "bg-pine text-white",
    outline: "border border-line bg-card text-ink",
    quiet: "text-pine",
    amber: "bg-amber text-white",
  };
  const classes = `${base} ${sizes} ${variants[variant]} ${full ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon ? <Icon name={icon} className="h-4 w-4" /> : null}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {icon ? <Icon name={icon} className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-line bg-card px-4 py-3 text-[15px] text-ink placeholder:text-faint outline-none transition focus:border-pine/40 focus:ring-4 focus:ring-pine/10";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-faint">{hint}</span> : null}
    </label>
  );
}

export function Chip({
  label,
  selected = false,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
        selected
          ? "border-pine bg-pine text-white"
          : "border-line bg-card text-soft"
      }`}
    >
      {label}
    </button>
  );
}

export function Tag({
  children,
  tone = "mint",
}: {
  children: ReactNode;
  tone?: "mint" | "amber" | "line";
}) {
  const tones = {
    mint: "bg-mint text-pine",
    amber: "bg-amber-soft text-amber",
    line: "bg-paper text-soft border border-line",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------- sheet ---------------------------------- */

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div
        className="absolute inset-0 animate-fade bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="sheet-shadow relative mt-auto flex max-h-[92%] w-full max-w-[430px] animate-rise flex-col rounded-t-[28px] bg-paper">
        <div className="shrink-0 px-5 pt-3">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
          <div className="flex items-start justify-between gap-4 pb-3">
            <h2 className="font-display text-[21px] leading-tight text-ink">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-card"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-6">
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-line bg-card/80 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------------- states ---------------------------------- */

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-[22px] border border-dashed border-line bg-card/60 px-6 py-10 text-center">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-mint text-pine">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="mt-1 max-w-[240px] text-[13px] leading-relaxed text-soft">
        {body}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-3 py-3 text-center">
      <p className="font-display text-[22px] leading-none text-ink">{value}</p>
      <p className="mt-1.5 text-[11px] uppercase tracking-wide text-faint">
        {label}
      </p>
    </div>
  );
}
