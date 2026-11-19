"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { Avatar, Button, Field, Sheet, Tag, inputClass } from "./ui";
import type { Job } from "@/lib/types";

export function JobSheet({
  job,
  match,
  saved,
  applied,
  onClose,
  onSave,
  onApply,
}: {
  job: Job | null;
  match?: number;
  saved: boolean;
  applied: boolean;
  onClose: () => void;
  onSave: () => void;
  onApply: (note: string) => void;
}) {
  const [stage, setStage] = useState<"detail" | "apply">("detail");
  const [note, setNote] = useState("");

  useEffect(() => {
    setStage("detail");
    setNote("");
  }, [job?.id]);

  const footer =
    stage === "apply" ? (
      <div className="space-y-3">
        <Field
          label="Message to the employer"
          hint="One short paragraph on why you fit. Keep it specific."
        >
          <textarea
            className={`${inputClass} min-h-[92px] resize-none`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="I am a 2026 Computer Science graduate with two React projects…"
          />
        </Field>
        <Button
          full
          onClick={() => {
            onApply(note);
            setStage("detail");
          }}
        >
          Send application
        </Button>
      </div>
    ) : (
      <div className="flex items-center gap-2.5">
        <Button variant="outline" onClick={onSave}>
          <Icon name="bookmark" className="h-4 w-4" />
          {saved ? "Saved" : "Save"}
        </Button>
        <Button
          full
          disabled={applied}
          onClick={() => setStage("apply")}
          icon={applied ? "check" : undefined}
        >
          {applied ? "Application sent" : "Apply now"}
        </Button>
      </div>
    );

  return (
    <Sheet
      open={Boolean(job)}
      onClose={onClose}
      title={job ? job.company : ""}
      footer={job ? footer : null}
    >
      {job ? (
        <div className="space-y-5 pb-2">
          <div className="flex items-start gap-3">
            <Avatar name={job.company} color={job.color} size={54} />
            <div className="min-w-0">
              <h2 className="font-display text-[22px] leading-tight text-ink">
                {job.title}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[12.5px] text-soft">
                {job.sector}
                <span className="text-line">|</span>
                {job.posted}
                {job.verified ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-pine">
                    <Icon name="shield" className="h-3.5 w-3.5" />
                    Verified
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Tag>{job.kind}</Tag>
            <Tag tone="line">{job.mode}</Tag>
            <Tag tone="line">
              <Icon name="pin" className="h-3 w-3" />
              {job.location}
            </Tag>
            {typeof match === "number" ? (
              <Tag tone="amber">{match}% match</Tag>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-line bg-card px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-wide text-faint">
                Pay
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">
                {job.salary}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-card px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-wide text-faint">
                Closing date
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">
                {job.deadline}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-ink">About the role</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-soft">
              {job.summary}
            </p>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-ink">What you will do</p>
            <ul className="mt-2 space-y-2">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <span className="text-[13.5px] leading-relaxed text-soft">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-ink">
              What they are looking for
            </p>
            <ul className="mt-2 space-y-2">
              {job.requirements.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Icon
                    name="check"
                    className="mt-0.5 h-4 w-4 shrink-0 text-pine"
                  />
                  <span className="text-[13.5px] leading-relaxed text-soft">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-ink">Skills</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <Tag key={skill} tone="line">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>

          {applied ? (
            <div className="flex items-start gap-2 rounded-2xl bg-mint px-4 py-3">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-pine" />
              <p className="text-[12.5px] leading-relaxed text-pine">
                Your application has been sent. You can follow its progress under
                Jobs → My applications.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </Sheet>
  );
}
