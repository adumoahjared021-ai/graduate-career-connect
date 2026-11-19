"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import {
  Avatar,
  Button,
  PageHeader,
  Progress,
  SectionHeading,
  Tag,
} from "@/components/ui";
import { profileChecks, profileCompletion } from "@/lib/logic";
import { useApp } from "@/lib/store";

const TOOLS: { href: string; icon: IconName; title: string; sub: string }[] = [
  {
    href: "/cv",
    icon: "edit",
    title: "CV Builder",
    sub: "Create a CV and save it as PDF",
  },
  {
    href: "/interview",
    icon: "message",
    title: "Interview practice",
    sub: "Structured answers to common questions",
  },
  {
    href: "/mentors",
    icon: "users",
    title: "Find a mentor",
    sub: "Ask a professional for guidance",
  },
  {
    href: "/portfolio",
    icon: "grid",
    title: "Digital portfolio",
    sub: "Show employers your projects",
  },
];

export default function ProfilePage() {
  const { profile, state, resetAll } = useApp();
  const [showChecks, setShowChecks] = useState(false);

  if (!profile) return null;

  const completion = profileCompletion(profile, state);
  const checks = profileChecks(profile, state);

  return (
    <div>
      <PageHeader
        title="Your profile"
        eyebrow="Account"
        action={
          <Link
            href="/onboarding"
            className="rounded-full border border-line bg-card px-3.5 py-2 text-[11.5px] font-semibold text-pine"
          >
            Edit
          </Link>
        }
      />

      <div className="px-5">
        <div className="rounded-[24px] border border-line bg-card px-5 py-6 text-center">
          <Avatar
            name={profile.name}
            color="#134e45"
            size={72}
            className="mx-auto"
          />
          <p className="mt-3 font-display text-[22px] leading-tight text-ink">
            {profile.name}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
            {profile.headline || "Add a headline so employers know what you offer"}
          </p>
          <p className="mt-1.5 text-[11px] text-faint">
            {profile.degree} · {profile.university} · Class of{" "}
            {profile.graduationYear}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {profile.skills.slice(0, 4).map((skill) => (
              <Tag key={skill} tone="line">
                {skill}
              </Tag>
            ))}
            {profile.skills.length > 4 ? (
              <Tag tone="line">+{profile.skills.length - 4}</Tag>
            ) : null}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            ["Applied", state.applications.length],
            ["Saved", state.savedJobs.length],
            ["Courses", state.enrolments.length],
            ["Mentors", state.mentorRequests.length],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-line bg-card py-2.5 text-center"
            >
              <p className="font-display text-[18px] leading-none text-ink">
                {value}
              </p>
              <p className="mt-1 text-[10px] text-faint">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-6 px-5">
        <SectionHeading title="Profile strength" />
        <div className="rounded-[20px] border border-line bg-card p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-[26px] leading-none text-ink">
                {completion}%
              </p>
              <p className="mt-1 text-[11.5px] text-soft">
                {checks.filter((check) => check.done).length} of {checks.length}{" "}
                steps complete
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowChecks(!showChecks)}
              className="text-[12px] font-semibold text-pine"
            >
              {showChecks ? "Hide steps" : "View steps"}
            </button>
          </div>
          <Progress value={completion} className="mt-3 h-2" />

          {showChecks ? (
            <ul className="mt-3 space-y-2 border-t border-line pt-3">
              {checks.map((check) => (
                <li key={check.label} className="flex items-center gap-2.5">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                      check.done ? "bg-pine text-white" : "bg-paper text-faint"
                    }`}
                  >
                    {check.done ? (
                      <Icon name="check" className="h-3 w-3" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <span
                    className={`text-[12.5px] ${
                      check.done ? "text-soft line-through" : "text-ink"
                    }`}
                  >
                    {check.label}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="mt-6 px-5">
        <SectionHeading title="Career tools" />
        <div className="overflow-hidden rounded-[20px] border border-line bg-card">
          {TOOLS.map((tool, index) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint text-pine">
                <Icon name={tool.icon} className="h-[17px] w-[17px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold text-ink">
                  {tool.title}
                </span>
                <span className="block text-[11px] text-faint">{tool.sub}</span>
              </span>
              <Icon name="chevronRight" className="h-4 w-4 text-faint" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <SectionHeading title="Details" />
        <div className="overflow-hidden rounded-[20px] border border-line bg-card">
          {[
            { icon: "mail" as IconName, value: profile.email },
            { icon: "phone" as IconName, value: profile.phone || "No phone added" },
            { icon: "pin" as IconName, value: profile.location || "No location added" },
            {
              icon: "graduation" as IconName,
              value: `${profile.degree}, ${profile.university}`,
            },
          ].map((row, index) => (
            <div
              key={row.icon}
              className={`flex items-center gap-3 px-4 py-3 ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <Icon name={row.icon} className="h-4 w-4 shrink-0 text-faint" />
              <span className="truncate text-[12.5px] text-soft">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-[20px] border border-line bg-card p-4">
          <p className="text-[13px] font-semibold text-ink">Demo data</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-soft">
            Everything you do is saved in this browser only. Resetting clears your
            profile, applications and progress so you can present from a clean
            start.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all demo data? Your profile, applications and progress will be deleted.",
                )
              ) {
                resetAll();
              }
            }}
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
            Reset demo data
          </Button>
        </div>
      </section>

      <p className="mt-6 text-center text-[10.5px] text-faint">
        Graduate Career Connect · Prototype
      </p>
    </div>
  );
}
