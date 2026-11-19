"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { Icon, Logo, type IconName } from "./icons";

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/jobs", label: "Jobs", icon: "briefcase" },
  { href: "/learn", label: "Learn", icon: "book" },
  { href: "/community", label: "Community", icon: "users" },
  { href: "/me", label: "Me", icon: "user" },
];

function Splash() {
  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col items-center justify-center gap-3 bg-paper sm:border-x sm:border-line">
      <Logo size={54} />
      <p className="font-display text-xl text-ink">Graduate Career Connect</p>
      <p className="text-xs text-faint">Opening your workspace…</p>
    </div>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="no-print shrink-0 border-t border-line bg-paper/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur">
      <ul className="flex items-stretch justify-between">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className="flex flex-col items-center gap-1 py-1"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`grid h-8 w-12 place-items-center rounded-full transition ${
                    active ? "bg-mint text-pine" : "text-faint"
                  }`}
                >
                  <Icon name={tab.icon} className="h-[21px] w-[21px]" />
                </span>
                <span
                  className={`text-[10px] font-semibold tracking-wide ${
                    active ? "text-pine" : "text-faint"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, profile } = useApp();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const isOnboarding = pathname.startsWith("/onboarding");
  const needsOnboarding = ready && !profile && !isOnboarding;

  useEffect(() => {
    if (needsOnboarding) router.replace("/onboarding");
  }, [needsOnboarding, router]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  if (!ready || needsOnboarding) return <Splash />;

  return (
    <div className="app-shell mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-paper sm:border-x sm:border-line sm:shadow-[0_0_70px_rgba(22,34,31,0.12)]">
      <main ref={mainRef} className="app-scroll no-scrollbar flex-1 overflow-y-auto">
        {children}
        <div className="h-6" />
      </main>
      {isOnboarding ? null : <BottomNav pathname={pathname} />}
    </div>
  );
}
