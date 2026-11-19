"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import {
  Avatar,
  Button,
  Field,
  PageHeader,
  SectionHeading,
  Sheet,
  Tag,
  inputClass,
} from "@/components/ui";
import { prettyDate } from "@/lib/logic";
import { MENTORS } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Mentor } from "@/lib/types";

const TOPICS = [
  "CV and applications",
  "Interview practice",
  "Career direction",
  "Portfolio review",
  "Industry advice",
];

const TIMES = ["Weekday evening", "Weekend", "Flexible"];

export default function MentorsPage() {
  const { state, requestMentor } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [preferred, setPreferred] = useState(TIMES[0]);

  const mentor = MENTORS.find((item) => item.id === openId) ?? null;
  const existing = mentor
    ? state.mentorRequests.find((entry) => entry.mentorId === mentor.id)
    : undefined;

  const openMentor = (item: Mentor) => {
    setOpenId(item.id);
    setMessage("");
    setTopic(TOPICS[0]);
    setPreferred(TIMES[0]);
  };

  return (
    <div>
      <PageHeader title="Mentors" eyebrow="Career support" />

      <div className="px-5">
        <div className="rounded-[20px] bg-pine px-4 py-4 text-white">
          <p className="font-display text-[17px] leading-snug">
            A mentor is one conversation away.
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-white/75">
            Every mentor here volunteered to help graduates. Ask a specific
            question and you will usually get a specific answer.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 px-5">
        {MENTORS.map((item) => {
          const requested = state.mentorRequests.some(
            (entry) => entry.mentorId === item.id,
          );
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openMentor(item)}
              className="w-full rounded-[20px] border border-line bg-card p-4 text-left active:scale-[0.995]"
            >
              <div className="flex items-start gap-3">
                <Avatar name={item.name} color={item.color} size={50} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-snug text-ink">
                    {item.name}
                  </p>
                  <p className="text-[12px] text-soft">
                    {item.role} · {item.company}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-mint px-2 py-1 text-[10.5px] font-bold text-pine">
                  {item.years} yrs
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.expertise.map((skill) => (
                  <Tag key={skill} tone="line">
                    {skill}
                  </Tag>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-faint">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  {item.availability}
                </span>
                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-pine">
                  {requested ? "Request sent" : "View profile"}
                  <Icon
                    name={requested ? "check" : "chevronRight"}
                    className="h-3.5 w-3.5"
                  />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {state.mentorRequests.length > 0 ? (
        <section className="mt-7 px-5">
          <SectionHeading title="Your requests" />
          <div className="space-y-2">
            {state.mentorRequests.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-line bg-card p-3.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13.5px] font-semibold text-ink">
                    {entry.mentorName}
                  </p>
                  <Tag tone={entry.status === "Accepted" ? "mint" : "amber"}>
                    {entry.status}
                  </Tag>
                </div>
                <p className="mt-1 text-[11.5px] text-soft">{entry.topic}</p>
                <p className="mt-1 text-[11px] text-faint">
                  Sent {prettyDate(entry.date)} · preferred {entry.preferred}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Sheet
        open={Boolean(mentor)}
        onClose={() => setOpenId(null)}
        title={mentor ? mentor.name : ""}
      >
        {mentor ? (
          <div className="space-y-4 pb-2">
            <div className="flex items-start gap-3">
              <Avatar name={mentor.name} color={mentor.color} size={54} />
              <div>
                <p className="font-display text-[18px] leading-tight text-ink">
                  {mentor.role}
                </p>
                <p className="text-[12.5px] text-soft">{mentor.company}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-faint">
                  <Icon name="clock" className="h-3 w-3" />
                  Replies in about {mentor.responseHours} hours
                </p>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed text-soft">{mentor.bio}</p>

            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>

            {existing ? (
              <div className="rounded-2xl bg-mint px-4 py-3.5">
                <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-pine">
                  <Icon name="check" className="h-4 w-4" />
                  Request sent on {prettyDate(existing.date)}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-pine/80">
                  Topic: {existing.topic}. Preferred time: {existing.preferred}.
                  You will see a status update on this page.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="mb-2 text-[13px] font-semibold text-ink">
                    What do you need help with?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTopic(option)}
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                          topic === option
                            ? "border-pine bg-pine text-white"
                            : "border-line bg-card text-soft"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <Field
                  label="Your message"
                  hint="A specific question gets a useful answer. Keep it short."
                >
                  <textarea
                    className={`${inputClass} min-h-[96px] resize-none`}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Hello, I am applying for graduate developer roles and my CV has no work experience…"
                  />
                </Field>

                <Field label="When could you meet?">
                  <select
                    className={inputClass}
                    value={preferred}
                    onChange={(event) => setPreferred(event.target.value)}
                  >
                    {TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </Field>

                <Button
                  full
                  disabled={message.trim().length < 10}
                  onClick={() =>
                    requestMentor(mentor, { topic, message, preferred })
                  }
                >
                  Send request
                </Button>
              </>
            )}
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}
