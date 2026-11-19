"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import {
  Button,
  Chip,
  EmptyState,
  Field,
  PageHeader,
  Sheet,
  Tag,
  inputClass,
} from "@/components/ui";
import { SKILL_OPTIONS } from "@/lib/seed";
import { useApp } from "@/lib/store";

const YEARS = ["2026", "2025", "2024", "2023", "2022"];

const blank = {
  title: "",
  role: "",
  year: "2026",
  description: "",
  link: "",
  skills: [] as string[],
};

export default function PortfolioPage() {
  const { profile, state, addProject, removeProject } = useApp();
  const [adding, setAdding] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [form, setForm] = useState(blank);

  if (!profile) return null;

  const canSave = form.title.trim().length > 1 && form.description.trim().length > 10;

  const submit = () => {
    addProject({
      title: form.title.trim(),
      role: form.role.trim(),
      year: form.year,
      description: form.description.trim(),
      link: form.link.trim(),
      skills: form.skills,
    });
    setForm(blank);
    setAdding(false);
  };

  return (
    <div>
      <PageHeader
        title="Portfolio"
        eyebrow="Show your work"
        back="/"
        action={
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="rounded-full border border-line bg-card px-3 py-2 text-[11.5px] font-semibold text-pine"
          >
            Employer view
          </button>
        }
      />

      <div className="px-5">
        <div className="rounded-[20px] border border-line bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-pine text-[15px] font-semibold text-white">
              {profile.name
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-ink">
                {profile.name}
              </p>
              <p className="truncate text-[12px] text-soft">{profile.headline}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 5).map((skill) => (
              <Tag key={skill} tone="line">
                {skill}
              </Tag>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-[11px] text-pine">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Visible to verified employers
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-5">
        <p className="text-[11.5px] text-faint">
          {state.projects.length} project{state.projects.length === 1 ? "" : "s"} ·{" "}
          {state.certificates.length} certificate
          {state.certificates.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-pine"
        >
          <Icon name="plus" className="h-3.5 w-3.5" />
          Add project
        </button>
      </div>

      <div className="mt-3 space-y-3 px-5">
        {state.projects.length === 0 ? (
          <EmptyState
            icon="grid"
            title="Your portfolio is empty"
            body="Projects, volunteering and coursework all count. Add one and describe what you built and why."
            action={
              <Button size="sm" onClick={() => setAdding(true)}>
                Add your first project
              </Button>
            }
          />
        ) : (
          state.projects.map((project) => (
            <div
              key={project.id}
              className="rounded-[20px] border border-line bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">
                    {project.year || "Project"}
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">
                    {project.title}
                  </p>
                  {project.role ? (
                    <p className="mt-0.5 text-[11.5px] text-soft">{project.role}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove “${project.title}” from your portfolio?`)) {
                      removeProject(project.id);
                    }
                  }}
                  aria-label="Remove project"
                  className="shrink-0 text-faint"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-2 text-[12.5px] leading-relaxed text-soft">
                {project.description}
              </p>

              {project.skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
              ) : null}

              {project.link ? (
                <p className="mt-3 inline-flex items-center gap-1.5 border-t border-line pt-2.5 text-[11.5px] font-medium text-pine">
                  <Icon name="link" className="h-3.5 w-3.5" />
                  {project.link}
                </p>
              ) : null}
            </div>
          ))
        )}

        {state.certificates.length > 0 ? (
          <div className="rounded-[20px] border border-line bg-card p-4">
            <p className="text-[13px] font-semibold text-ink">Certificates</p>
            <ul className="mt-2 space-y-2">
              {state.certificates.map((cert) => (
                <li
                  key={cert.id}
                  className="flex items-center gap-2 text-[12px] text-soft"
                >
                  <Icon name="award" className="h-4 w-4 shrink-0 text-amber" />
                  {cert.title}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <Sheet
        open={adding}
        onClose={() => setAdding(false)}
        title="Add a project"
        footer={
          <Button full disabled={!canSave} onClick={submit}>
            Add to my portfolio
          </Button>
        }
      >
        <div className="space-y-3 pb-2">
          <Field label="Project title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="e.g. Campus study group finder"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Your role">
              <input
                className={inputClass}
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                placeholder="Solo project"
              />
            </Field>
            <Field label="Year">
              <select
                className={inputClass}
                value={form.year}
                onChange={(event) => setForm({ ...form, year: event.target.value })}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field
            label="What did you build?"
            hint="Problem, what you did, and the result. Two or three sentences."
          >
            <textarea
              className={`${inputClass} min-h-[96px] resize-none`}
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="Students struggled to find study partners, so I built…"
            />
          </Field>
          <Field label="Link" hint="GitHub, live site or a shared folder.">
            <input
              className={inputClass}
              value={form.link}
              onChange={(event) => setForm({ ...form, link: event.target.value })}
              placeholder="github.com/you/project"
            />
          </Field>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink">
              Skills used
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  selected={form.skills.includes(skill)}
                  onClick={() =>
                    setForm({
                      ...form,
                      skills: form.skills.includes(skill)
                        ? form.skills.filter((item) => item !== skill)
                        : [...form.skills, skill],
                    })
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </Sheet>

      <Sheet
        open={previewing}
        onClose={() => setPreviewing(false)}
        title="What employers see"
      >
        <div className="space-y-4 pb-2">
          <div className="rounded-[20px] bg-pine p-5 text-white">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/60">
              Graduate profile
            </p>
            <p className="mt-1.5 font-display text-[24px] leading-tight">
              {profile.name}
            </p>
            <p className="mt-1 text-[12.5px] text-white/80">{profile.headline}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/60">
              <Icon name="pin" className="h-3 w-3" />
              {profile.location || "Location not set"} ·{" "}
              {profile.graduationYear} graduate
            </p>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-ink">About</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
              {profile.about || "No summary added yet."}
            </p>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-ink">Skills</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <Tag key={skill} tone="line">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-ink">Projects</p>
            <div className="mt-2 space-y-2">
              {state.projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-line px-3 py-2.5"
                >
                  <p className="text-[12.5px] font-semibold text-ink">
                    {project.title}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-soft">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="rounded-2xl bg-mint px-4 py-3 text-[11.5px] leading-relaxed text-pine">
            Employers only see this summary and your projects. Your contact
            details stay hidden until you apply for one of their roles.
          </p>
        </div>
      </Sheet>
    </div>
  );
}
