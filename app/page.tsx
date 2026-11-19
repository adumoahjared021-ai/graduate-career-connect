"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { JobCard } from "@/components/JobCard";
import { JobSheet } from "@/components/JobSheet";
import { Avatar, Progress, SectionHeading, Tag } from "@/components/ui";
import {
  courseProgress,
  greeting,
  matchScore,
  profileChecks,
  profileCompletion,
  recommendedJobs,
} from "@/lib/logic";
import { COURSES } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Job } from "@/lib/types";

const explore: { href: string; icon: IconName; title: string; sub: string }[] = [
  { href: "/jobs", icon: "briefcase", title: "Find jobs", sub: "Explore vacancies" },
  {
    href: "/jobs?type=Internship",
    icon: "graduation",
    title: "Internships",
    sub: "Gain experience",
  },
  { href: "/mentors", icon: "users", title: "Find mentors", sub: "Get guidance" },
  { href: "/learn", icon: "book", title: "Learn skills", sub: "Improve yourself" },
];

const quick: { href: string; icon: IconName; label: string }[] = [
  { href: "/cv", icon: "edit", label: "Build my CV" },
  { href: "/portfolio", icon: "grid", label: "Add portfolio" },
  { href: "/interview", icon: "message", label: "Practise interview" },
];

export default function DashboardPage() {
  const { profile, state, toggleSavedJob, applyToJob } = useApp();
  const [openJob, setOpenJob] = useState<Job | null>(null);
  if (!profile) return null;

  const completion = profileCompletion(profile, state);
  const checks = profileChecks(profile, state);
  const nextStep = checks.find((check) => !check.done);
  const jobs = recommendedJobs(profile, 2);
  const firstName = profile.name.split(" ")[0];

  const activeCourse =
    COURSES.find(
      (course) =>
        state.enrolments.includes(course.id) &&
        courseProgress(state, course) < 100,
    ) ?? COURSES.find((course) => !state.enrolments.includes(course.id))!;
  const activeProgress = courseProgress(state, activeCourse);

  return (
    <div className="pb-2">
      <header className="flex items-start justify-between gap-4 px-5 pt-6">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-faint">
            {greeting()}
          </p>
          <h1 className="mt-1 font-display text-[27px] leading-tight text-ink">
            Welcome, {firstName}!
          </h1>
          <p className="mt-1.5 max-w-[240px] text-[12.5px] leading-relaxed text-soft">
            Build your skills. Find opportunities. Shape your future.
          </p>
        </div>
        <Link href="/me" aria-label="Open your profile" className="mt-1">
          <Avatar name={profile.name} color="#134e45" size={44} />
        </Link>
      </header>

      <section className="mt-5 px-5">
        <div className="relative overflow-hidden rounded-[24px] bg-pine p-5 text-white">
          <div
            className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full opacity-20"
            style={{ background: "#e6f1ec" }}
          />
          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Profile completion
              </p>
              <p className="mt-1 font-display text-[34px] leading-none">
                {completion}%
              </p>
            </div>
            <Link
              href="/me"
              className="rounded-full bg-white/15 px-3.5 py-2 text-[12px] font-semibold text-white"
            >
              {completion === 100 ? "View profile" : "Finish profile"}
            </Link>
          </div>
          <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="relative mt-3 text-[12px] text-white/75">
            {nextStep
              ? `Next: ${nextStep.label.toLowerCase()}`
              : "Everything is complete. Your profile is ready for employers."}
          </p>
        </div>
      </section>

      <section className="mt-7 px-5">
        <SectionHeading title="Explore your opportunities" />
        <div className="grid grid-cols-2 gap-2.5">
          {explore.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[20px] border border-line bg-card p-4 transition active:scale-[0.99]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-mint text-pine">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[14px] font-semibold leading-tight text-ink">
                {item.title}
              </p>
              <p className="mt-1 flex items-center justify-between text-[11.5px] text-soft">
                {item.sub}
                <Icon
                  name="chevronRight"
                  className="h-3.5 w-3.5 text-faint transition group-hover:translate-x-0.5"
                />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="px-5">
          <SectionHeading
            title="Recommended for you"
            action={
              <Link
                href="/jobs"
                className="text-[12.5px] font-semibold text-pine"
              >
                See all
              </Link>
            }
          />
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
          {jobs.map((job) => (
            <div key={job.id} className="w-[290px] shrink-0">
              <JobCard
                job={job}
                match={matchScore(job, profile)}
                saved={state.savedJobs.includes(job.id)}
                onSave={() => toggleSavedJob(job.id)}
                onOpen={() => setOpenJob(job)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 px-5">
        <SectionHeading title="Quick actions" />
        <div className="grid grid-cols-3 gap-2.5">
          {quick.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-[18px] border border-line bg-card px-2 py-4 text-center active:scale-[0.99]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-soft text-amber">
                <Icon name={item.icon} className="h-[19px] w-[19px]" />
              </span>
              <span className="text-[11.5px] font-semibold leading-tight text-ink">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 px-5">
        <SectionHeading
          title={activeProgress > 0 ? "Continue learning" : "Start learning"}
          action={
            <Link href="/learn" className="text-[12.5px] font-semibold text-pine">
              All courses
            </Link>
          }
        />
        <Link
          href="/learn"
          className="block rounded-[20px] border border-line bg-card p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Tag>{activeCourse.category}</Tag>
              <p className="mt-2 text-[15px] font-semibold leading-snug text-ink">
                {activeCourse.title}
              </p>
              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-soft">
                {activeCourse.blurb}
              </p>
            </div>
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] text-white"
              style={{ background: activeCourse.color }}
            >
              <Icon name="play" className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={activeProgress} />
            <span className="shrink-0 text-[11px] font-semibold text-soft">
              {activeProgress}%
            </span>
          </div>
        </Link>
      </section>

      <JobSheet
        job={openJob}
        match={openJob ? matchScore(openJob, profile) : undefined}
        saved={openJob ? state.savedJobs.includes(openJob.id) : false}
        applied={
          openJob
            ? state.applications.some((entry) => entry.jobId === openJob.id)
            : false
        }
        onClose={() => setOpenJob(null)}
        onSave={() => openJob && toggleSavedJob(openJob.id)}
        onApply={(note) => openJob && applyToJob(openJob, note)}
      />
    </div>
  );
}
