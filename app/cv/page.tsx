"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Button, Chip, Field, inputClass } from "@/components/ui";
import { uid } from "@/lib/logic";
import { SKILL_OPTIONS } from "@/lib/seed";
import { emptyCv, useApp } from "@/lib/store";
import type { CvDraft, CvEntry } from "@/lib/types";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="border-b border-line pb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-pine">
      {children}
    </p>
  );
}

function EntryBlock({ entry }: { entry: CvEntry }) {
  if (!entry.heading && !entry.subheading) return null;
  return (
    <div className="mt-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11.5px] font-bold text-ink">
          {entry.heading || "Organisation"}
        </p>
        <p className="shrink-0 text-[9.5px] text-soft">{entry.period}</p>
      </div>
      {entry.subheading ? (
        <p className="text-[10.5px] text-soft">{entry.subheading}</p>
      ) : null}
      {entry.details ? (
        <p className="mt-0.5 text-[10.5px] leading-relaxed text-soft">
          {entry.details}
        </p>
      ) : null}
    </div>
  );
}

function CvPreview({ draft }: { draft: CvDraft }) {
  return (
    <div className="cv-sheet rounded-[6px] border border-line bg-white px-6 py-7 shadow-[0_10px_30px_rgba(22,34,31,0.08)]">
      <header>
        <h2 className="font-display text-[23px] leading-tight text-ink">
          {draft.fullName || "Your name"}
        </h2>
        <p className="mt-0.5 text-[11.5px] font-semibold text-pine">
          {draft.title || "Your professional headline"}
        </p>
        <p className="mt-1.5 text-[9.5px] leading-relaxed text-soft">
          {[draft.email, draft.phone, draft.location].filter(Boolean).join("  ·  ")}
        </p>
      </header>

      {draft.summary ? (
        <section className="mt-5">
          <SectionLabel>Profile</SectionLabel>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-soft">
            {draft.summary}
          </p>
        </section>
      ) : null}

      {draft.education.some((entry) => entry.heading) ? (
        <section className="mt-4">
          <SectionLabel>Education</SectionLabel>
          {draft.education.map((entry) => (
            <EntryBlock key={entry.id} entry={entry} />
          ))}
        </section>
      ) : null}

      {draft.experience.some((entry) => entry.heading) ? (
        <section className="mt-4">
          <SectionLabel>Experience</SectionLabel>
          {draft.experience.map((entry) => (
            <EntryBlock key={entry.id} entry={entry} />
          ))}
        </section>
      ) : null}

      {draft.skills.length > 0 ? (
        <section className="mt-4">
          <SectionLabel>Skills</SectionLabel>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-soft">
            {draft.skills.join("  ·  ")}
          </p>
        </section>
      ) : null}

      {draft.link ? (
        <section className="mt-4">
          <SectionLabel>Portfolio</SectionLabel>
          <p className="mt-1.5 text-[10.5px] text-soft">{draft.link}</p>
        </section>
      ) : null}
    </div>
  );
}

export default function CvPage() {
  const { profile, state, saveCv } = useApp();
  const [mode, setMode] = useState<"preview" | "edit">("preview");

  useEffect(() => {
    if (!state.cv && profile) saveCv(emptyCv(profile));
  }, [state.cv, profile, saveCv]);

  if (!profile) return null;

  const draft: CvDraft = state.cv ?? emptyCv(profile);

  const update = (patch: Partial<CvDraft>) => saveCv({ ...draft, ...patch });

  const updateEntry = (
    key: "education" | "experience",
    id: string,
    patch: Partial<CvEntry>,
  ) =>
    update({
      [key]: draft[key].map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    });

  const addEntry = (key: "education" | "experience") =>
    update({
      [key]: [
        ...draft[key],
        { id: uid(), heading: "", subheading: "", period: "", details: "" },
      ],
    });

  const removeEntry = (key: "education" | "experience", id: string) =>
    update({ [key]: draft[key].filter((entry) => entry.id !== id) });

  const toggleSkill = (skill: string) =>
    update({
      skills: draft.skills.includes(skill)
        ? draft.skills.filter((item) => item !== skill)
        : [...draft.skills, skill],
    });

  return (
    <div>
      <div className="no-print sticky top-0 z-30 bg-paper/95 px-5 pt-4 pb-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/me"
            aria-label="Go back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-card"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
              Career tools
            </p>
            <h1 className="truncate font-display text-[26px] leading-tight">
              CV Builder
            </h1>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-pine"
            aria-label="Print or save as PDF"
          >
            <Icon name="download" className="h-[17px] w-[17px]" />
          </button>
        </div>

        <div className="mt-3 flex rounded-full bg-mint/70 p-1">
          {(["preview", "edit"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`flex-1 rounded-full px-3 py-2 text-[12.5px] font-semibold capitalize transition ${
                mode === value ? "bg-card text-pine shadow-sm" : "text-soft"
              }`}
            >
              {value === "edit" ? "Edit details" : "Preview"}
            </button>
          ))}
        </div>
      </div>

      {mode === "preview" ? (
        <div className="px-5 pb-4">
          <CvPreview draft={draft} />
          <div className="no-print mt-4 flex items-center justify-between gap-3 rounded-2xl bg-mint px-4 py-3">
            <p className="text-[11.5px] leading-relaxed text-pine">
              Printing gives you a clean PDF you can attach to applications.
            </p>
            <Button size="sm" onClick={() => window.print()}>
              Save PDF
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 px-5">
          <div className="space-y-3">
            <Field label="Full name">
              <input
                className={inputClass}
                value={draft.fullName}
                onChange={(event) => update({ fullName: event.target.value })}
              />
            </Field>
            <Field label="Headline" hint="The role you want, not the role you had.">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(event) => update({ title: event.target.value })}
                placeholder="e.g. Junior software developer"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <input
                  className={inputClass}
                  value={draft.email}
                  onChange={(event) => update({ email: event.target.value })}
                />
              </Field>
              <Field label="Phone">
                <input
                  className={inputClass}
                  value={draft.phone}
                  onChange={(event) => update({ phone: event.target.value })}
                />
              </Field>
            </div>
            <Field label="Location">
              <input
                className={inputClass}
                value={draft.location}
                onChange={(event) => update({ location: event.target.value })}
              />
            </Field>
            <Field
              label="Profile summary"
              hint="Three sentences: what you studied, what you can do, what you want next."
            >
              <textarea
                className={`${inputClass} min-h-[96px] resize-none`}
                value={draft.summary}
                onChange={(event) => update({ summary: event.target.value })}
              />
            </Field>
          </div>

          {(["education", "experience"] as const).map((key) => (
            <section key={key}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-semibold capitalize text-ink">
                  {key}
                </p>
                <button
                  type="button"
                  onClick={() => addEntry(key)}
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-pine"
                >
                  <Icon name="plus" className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {draft[key].length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-line px-4 py-3 text-[12px] text-faint">
                    {key === "experience"
                      ? "No work yet? Add a project, volunteering or internship and describe it like a job."
                      : "Add your degree, diploma or secondary school."}
                  </p>
                ) : null}
                {draft[key].map((entry) => (
                  <div
                    key={entry.id}
                    className="space-y-2 rounded-2xl border border-line bg-card p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">
                        Entry
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEntry(key, entry.id)}
                        className="text-faint"
                        aria-label="Remove entry"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      className={inputClass}
                      placeholder={
                        key === "education" ? "University or school" : "Organisation"
                      }
                      value={entry.heading}
                      onChange={(event) =>
                        updateEntry(key, entry.id, { heading: event.target.value })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder={
                        key === "education" ? "Degree or programme" : "Your role"
                      }
                      value={entry.subheading}
                      onChange={(event) =>
                        updateEntry(key, entry.id, {
                          subheading: event.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="e.g. 2022 - 2026"
                      value={entry.period}
                      onChange={(event) =>
                        updateEntry(key, entry.id, { period: event.target.value })
                      }
                    />
                    <textarea
                      className={`${inputClass} min-h-[72px] resize-none`}
                      placeholder="What you did and what changed. Use numbers where you can."
                      value={entry.details}
                      onChange={(event) =>
                        updateEntry(key, entry.id, { details: event.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">Skills</p>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  selected={draft.skills.includes(skill)}
                  onClick={() => toggleSkill(skill)}
                />
              ))}
            </div>
          </div>

          <Field label="Portfolio or GitHub link" hint="Optional but strongly recommended.">
            <input
              className={inputClass}
              value={draft.link}
              onChange={(event) => update({ link: event.target.value })}
              placeholder="github.com/yourname"
            />
          </Field>

          <Button full onClick={() => setMode("preview")}>
            Done, show my CV
          </Button>
        </div>
      )}
    </div>
  );
}
