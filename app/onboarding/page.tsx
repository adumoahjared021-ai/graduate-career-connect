"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/icons";
import {
  Button,
  Chip,
  Field,
  Progress,
  inputClass,
} from "@/components/ui";
import {
  INTEREST_OPTIONS,
  SAMPLE_PROFILE,
  SKILL_OPTIONS,
  UNIVERSITIES,
} from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Profile } from "@/lib/types";

const YEARS = ["2024", "2025", "2026", "2027", "2028", "2029"];

const blank: Profile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  university: "",
  degree: "",
  graduationYear: "2026",
  headline: "",
  about: "",
  skills: [],
  interests: [],
};

export default function OnboardingPage() {
  const { profile, saveProfile } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Profile>(profile ?? blank);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggle = (key: "skills" | "interests", value: string) =>
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));

  const emailOk = /\S+@\S+\.\S+/.test(form.email);
  const stepOneOk = form.name.trim().length > 1 && emailOk;
  const stepTwoOk =
    form.university !== "" && form.degree.trim().length > 1;
  const stepThreeOk = form.skills.length >= 1;

  const canContinue = [stepOneOk, stepTwoOk, stepThreeOk][step];

  const headings = [
    {
      title: "Let's start with you",
      body: "Your account is the base of your profile. Employers see your name and contact details only when you apply.",
    },
    {
      title: "Where did you study?",
      body: "Your qualification helps us match you to graduate schemes and entry-level roles.",
    },
    {
      title: "What are you aiming for?",
      body: "Pick the skills you already have and the areas you want to work in. We use these to rank opportunities for you.",
    },
  ];

  const finish = () => {
    saveProfile({ ...form, name: form.name.trim(), email: form.email.trim() });
    router.push("/");
  };

  return (
    <div className="flex min-h-full flex-col px-6 pt-7 pb-8">
      <div className="flex items-center gap-2.5">
        <Logo size={34} />
        <div>
          <p className="font-display text-[15px] leading-none text-ink">
            Graduate Career Connect
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-faint">
            {profile ? "Update your profile" : "Create your account"}
          </p>
        </div>
      </div>

      <div className="mt-7">
        <Progress value={((step + 1) / 3) * 100} className="h-1" />
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
          Step {step + 1} of 3
        </p>
        <h1 className="mt-2 font-display text-[30px] leading-[1.15] text-ink">
          {headings[step].title}
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-soft">
          {headings[step].body}
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-4">
        {step === 0 ? (
          <>
            <Field label="Full name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(event) => set("name", event.target.value)}
                placeholder="e.g. Akosua Mensah"
                autoComplete="name"
              />
            </Field>
            <Field label="Email address">
              <input
                className={inputClass}
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
              />
            </Field>
            <Field label="Phone number" hint="Optional, but employers often call first.">
              <input
                className={inputClass}
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
                placeholder="+233 20 000 0000"
                type="tel"
              />
            </Field>
            <button
              type="button"
              onClick={() => setForm(SAMPLE_PROFILE)}
              className="text-[13px] font-semibold text-pine underline decoration-pine/30 underline-offset-4"
            >
              Fill with example details instead
            </button>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Field label="University">
              <select
                className={inputClass}
                value={form.university}
                onChange={(event) => set("university", event.target.value)}
              >
                <option value="">Select your university</option>
                {UNIVERSITIES.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Degree or programme">
              <input
                className={inputClass}
                value={form.degree}
                onChange={(event) => set("degree", event.target.value)}
                placeholder="e.g. BSc Computer Science"
              />
            </Field>
            <Field label="Graduation year">
              <select
                className={inputClass}
                value={form.graduationYear}
                onChange={(event) => set("graduationYear", event.target.value)}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Where are you based?">
              <input
                className={inputClass}
                value={form.location}
                onChange={(event) => set("location", event.target.value)}
                placeholder="e.g. Accra, Ghana"
              />
            </Field>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Field label="Your headline" hint="One line that sums up what you offer.">
              <input
                className={inputClass}
                value={form.headline}
                onChange={(event) => set("headline", event.target.value)}
                placeholder="e.g. Graduate developer looking for a first role"
              />
            </Field>

            <div>
              <p className="mb-2 text-[13px] font-semibold text-ink">
                Skills you already have
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    selected={form.skills.includes(skill)}
                    onClick={() => toggle("skills", skill)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[13px] font-semibold text-ink">
                Sectors that interest you
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    selected={form.interests.includes(interest)}
                    onClick={() => toggle("interests", interest)}
                  />
                ))}
              </div>
            </div>

            <Field
              label="A short about you"
              hint="Two or three sentences is plenty. You can change this later."
            >
              <textarea
                className={`${inputClass} min-h-[104px] resize-none`}
                value={form.about}
                onChange={(event) => set("about", event.target.value)}
                placeholder="What you studied, what you enjoy building or doing, and what kind of role you want next."
              />
            </Field>
          </>
        ) : null}
      </div>

      <div className="mt-7 flex items-center gap-3">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : null}
        <Button
          full
          disabled={!canContinue}
          onClick={() => (step === 2 ? finish() : setStep(step + 1))}
        >
          {step === 2 ? "Create my profile" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
