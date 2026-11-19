import { JOBS } from "./seed";
import type { AppState, Course, Job, Profile } from "./types";

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function prettyDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function initials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function profileChecks(profile: Profile | null, state: AppState) {
  return [
    { label: "Account created", done: Boolean(profile?.name && profile?.email) },
    { label: "University added", done: Boolean(profile?.university) },
    { label: "Degree added", done: Boolean(profile?.degree) },
    { label: "Graduation year", done: Boolean(profile?.graduationYear) },
    { label: "Location added", done: Boolean(profile?.location) },
    { label: "Headline written", done: Boolean(profile?.headline) },
    {
      label: "About section (60+ characters)",
      done: (profile?.about.length ?? 0) >= 60,
    },
    { label: "At least 3 skills", done: (profile?.skills.length ?? 0) >= 3 },
    { label: "At least 1 interest", done: (profile?.interests.length ?? 0) >= 1 },
    { label: "CV started", done: Boolean(state.cv) },
    { label: "Portfolio project added", done: state.projects.length > 0 },
  ];
}

export function profileCompletion(profile: Profile | null, state: AppState): number {
  const checks = profileChecks(profile, state);
  const done = checks.filter((check) => check.done).length;
  return Math.round((done / checks.length) * 100);
}

export function matchScore(job: Job, profile: Profile | null): number {
  if (!profile) return 0;
  const skills = new Set(profile.skills);
  const overlap = job.skills.filter((skill) => skills.has(skill)).length;
  const interestMatch = profile.interests.includes(job.sector) ? 1 : 0;
  return Math.min(98, 40 + overlap * 18 + interestMatch * 12);
}

export function recommendedJobs(profile: Profile | null, limit = 3): Job[] {
  return [...JOBS]
    .sort((a, b) => matchScore(b, profile) - matchScore(a, profile))
    .slice(0, limit);
}

export function courseProgress(state: AppState, course: Course): number {
  const done = state.completed[course.id]?.length ?? 0;
  return Math.round((done / course.lessons.length) * 100);
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
