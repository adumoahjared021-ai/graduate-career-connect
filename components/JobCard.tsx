"use client";

import { Icon } from "./icons";
import { Avatar } from "./ui";
import type { Job } from "@/lib/types";

export function JobCard({
  job,
  saved,
  match,
  onSave,
  onOpen,
}: {
  job: Job;
  saved: boolean;
  match?: number;
  onSave: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-line bg-card">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full p-4 pr-14 text-left"
      >
        <div className="flex items-start gap-3">
          <Avatar
            name={job.company}
            color={job.color}
            size={44}
            className="font-display"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-[12.5px] text-soft">
              {job.company}
              {job.verified ? (
                <Icon name="shield" className="h-3.5 w-3.5 text-pine" />
              ) : null}
            </p>
            <h3 className="mt-0.5 text-[15.5px] font-semibold leading-snug text-ink">
              {job.title}
            </h3>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-semibold text-pine">
            {job.kind}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-soft">
            {job.mode}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-faint">
            <Icon name="pin" className="h-3.5 w-3.5" />
            {job.location}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-ink">
              {job.salary}
            </p>
            <p className="mt-0.5 text-[11px] text-faint">
              Posted {job.posted} · closes {job.deadline}
            </p>
          </div>
          {typeof match === "number" ? (
            <span className="shrink-0 rounded-full bg-amber-soft px-2.5 py-1 text-[11px] font-bold text-amber">
              {match}% match
            </span>
          ) : null}
        </div>
      </button>

      <button
        type="button"
        onClick={onSave}
        aria-label={saved ? "Remove from saved" : "Save opportunity"}
        aria-pressed={saved}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border transition ${
          saved
            ? "border-pine bg-pine text-white"
            : "border-line bg-paper text-soft"
        }`}
      >
        <Icon name="bookmark" className="h-4 w-4" />
      </button>
    </div>
  );
}
