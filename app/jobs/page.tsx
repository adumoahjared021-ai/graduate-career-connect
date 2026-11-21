"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { JobCard } from "@/components/JobCard";
import { JobSheet } from "@/components/JobSheet";
import {
  Button,
  EmptyState,
  PageHeader,
  inputClass,
} from "@/components/ui";
import { matchScore, prettyDate } from "@/lib/logic";
import { JOBS } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Application, Job } from "@/lib/types";

type Tab = "browse" | "saved" | "applied";
type KindFilter = "All" | "Job" | "Internship" | "Graduate programme";

const KINDS: KindFilter[] = ["All", "Job", "Internship", "Graduate programme"];
const SHORT: Record<KindFilter, string> = {
  All: "All",
  Job: "Jobs",
  Internship: "Internships",
  "Graduate programme": "Graduate",
};

const SECTORS = [...new Set(JOBS.map((job) => job.sector))].sort((a, b) => {
  const count = (sector: string) =>
    JOBS.filter((job) => job.sector === sector).length;
  return count(b) - count(a) || a.localeCompare(b);
});

const STAGES: Application["status"][] = [
  "Submitted",
  "Under review",
  "Interview",
  "Offer",
];

function ApplicationCard({ application }: { application: Application }) {
  const reached = STAGES.indexOf(application.status);
  return (
    <div className="rounded-[20px] border border-line bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] text-soft">{application.company}</p>
          <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">
            {application.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            application.status === "Offer"
              ? "bg-amber-soft text-amber"
              : "bg-mint text-pine"
          }`}
        >
          {application.status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1">
        {STAGES.map((stage, index) => (
          <div key={stage} className="flex flex-1 flex-col gap-1.5">
            <div
              className={`h-1.5 rounded-full ${
                index <= reached ? "bg-pine" : "bg-line"
              }`}
            />
            <span
              className={`text-[9.5px] leading-tight ${
                index <= reached ? "font-semibold text-pine" : "text-faint"
              }`}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 border-t border-line pt-3 text-[11.5px] text-faint">
        Applied {prettyDate(application.date)}
      </p>
    </div>
  );
}

export default function JobsPage() {
  const { profile, state, toggleSavedJob, applyToJob } = useApp();
  const [tab, setTab] = useState<Tab>("browse");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("All");
  const [sector, setSector] = useState("All");
  const [openJob, setOpenJob] = useState<Job | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("type");
    if (param === "Job" || param === "Internship" || param === "Graduate programme") {
      setKind(param);
    }
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return JOBS.filter((job) => {
      const matchesKind = kind === "All" || job.kind === kind;
      const matchesSector = sector === "All" || job.sector === sector;
      const matchesQuery =
        needle === "" ||
        `${job.title} ${job.company} ${job.sector} ${job.location} ${job.skills.join(" ")}`
          .toLowerCase()
          .includes(needle);
      return matchesKind && matchesSector && matchesQuery;
    }).sort((a, b) => matchScore(b, profile) - matchScore(a, profile));
  }, [kind, sector, query, profile]);

  const savedJobs = JOBS.filter((job) => state.savedJobs.includes(job.id));

  return (
    <div>
      <PageHeader title="Opportunities" eyebrow="Find your next step" />

      <div className="px-5">
        <div className="flex rounded-full bg-mint/70 p-1">
          {(
            [
              ["browse", `Browse · ${JOBS.length}`],
              ["saved", `Saved · ${savedJobs.length}`],
              ["applied", `Applied · ${state.applications.length}`],
            ] as [Tab, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`flex-1 rounded-full px-2 py-2 text-[12px] font-semibold transition ${
                tab === value ? "bg-card text-pine shadow-sm" : "text-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "browse" ? (
        <>
          <div className="mt-4 px-5">
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
              />
              <input
                className={`${inputClass} pl-11`}
                placeholder="Search roles, companies, skills"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
            {KINDS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setKind(option)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition ${
                  kind === option
                    ? "border-pine bg-pine text-white"
                    : "border-line bg-card text-soft"
                }`}
              >
                {SHORT[option]}
              </button>
            ))}
          </div>

          <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto px-5 pb-1">
            {["All", ...SECTORS].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSector(option)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-medium transition ${
                  sector === option
                    ? "bg-mint text-pine"
                    : "text-soft"
                }`}
              >
                {option === "All" ? "All sectors" : option}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3 px-5">
            <p className="text-[11.5px] text-faint">
              {results.length} opportunit{results.length === 1 ? "y" : "ies"} · ranked
              by how well they match your profile
            </p>
            {results.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                match={matchScore(job, profile)}
                saved={state.savedJobs.includes(job.id)}
                onSave={() => toggleSavedJob(job.id)}
                onOpen={() => setOpenJob(job)}
              />
            ))}
            {results.length === 0 ? (
              <EmptyState
                icon="search"
                title="Nothing matched"
                body="Try a different search term or clear the filters to see every opportunity."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setKind("All");
                      setSector("All");
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            ) : null}
          </div>
        </>
      ) : null}

      {tab === "saved" ? (
        <div className="mt-4 space-y-3 px-5">
          {savedJobs.length === 0 ? (
            <EmptyState
              icon="bookmark"
              title="No saved opportunities"
              body="Tap the bookmark on any role to keep it here while you decide."
              action={
                <Button size="sm" variant="outline" onClick={() => setTab("browse")}>
                  Browse opportunities
                </Button>
              }
            />
          ) : (
            savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                match={matchScore(job, profile)}
                saved
                onSave={() => toggleSavedJob(job.id)}
                onOpen={() => setOpenJob(job)}
              />
            ))
          )}
        </div>
      ) : null}

      {tab === "applied" ? (
        <div className="mt-4 space-y-3 px-5">
          {state.applications.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="No applications yet"
              body="When you apply for a role, you can follow every stage here."
              action={
                <Button size="sm" variant="outline" onClick={() => setTab("browse")}>
                  Find a role to apply for
                </Button>
              }
            />
          ) : (
            state.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </div>
      ) : null}

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
