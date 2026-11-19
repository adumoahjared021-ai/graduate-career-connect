"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import {
  Button,
  Field,
  PageHeader,
  Sheet,
  Stat,
  Tag,
  inputClass,
} from "@/components/ui";
import { INTERVIEW_QUESTIONS } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { InterviewQuestion } from "@/lib/types";

const CATEGORIES = ["All", "Behavioural", "Competency", "Technical", "Career"];

function Stars({ score, size = "h-3.5 w-3.5" }: { score: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Icon
          key={value}
          name="star"
          className={`${size} ${
            value <= score ? "fill-amber text-amber" : "text-line"
          }`}
        />
      ))}
    </span>
  );
}

export default function InterviewPage() {
  const { state, recordInterview } = useApp();
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [rating, setRating] = useState(0);

  const best = (questionId: string) =>
    state.interviews
      .filter((attempt) => attempt.questionId === questionId)
      .reduce((top, attempt) => Math.max(top, attempt.score), 0);

  const average =
    state.interviews.length > 0
      ? (
          state.interviews.reduce((sum, attempt) => sum + attempt.score, 0) /
          state.interviews.length
        ).toFixed(1)
      : "–";

  const practised = new Set(state.interviews.map((attempt) => attempt.questionId))
    .size;

  const questions =
    category === "All"
      ? INTERVIEW_QUESTIONS
      : INTERVIEW_QUESTIONS.filter((item) => item.category === category);

  const openQuestion: InterviewQuestion | null =
    INTERVIEW_QUESTIONS.find((item) => item.id === openId) ?? null;

  const openSheet = (question: InterviewQuestion) => {
    setOpenId(question.id);
    setRevealed(false);
    setAnswer("");
    setRating(0);
  };

  return (
    <div>
      <PageHeader title="Interview practice" eyebrow="Career tools" back="/" />

      <div className="px-5">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Questions" value={INTERVIEW_QUESTIONS.length} />
          <Stat label="Practised" value={practised} />
          <Stat label="Confidence" value={`${average}/5`} />
        </div>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {CATEGORIES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition ${
              category === option
                ? "border-pine bg-pine text-white"
                : "border-line bg-card text-soft"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5 px-5">
        {questions.map((question) => {
          const score = best(question.id);
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => openSheet(question)}
              className="w-full rounded-[20px] border border-line bg-card p-4 text-left active:scale-[0.995]"
            >
              <div className="flex items-center justify-between gap-2">
                <Tag tone="line">{question.category}</Tag>
                {score > 0 ? <Stars score={score} /> : null}
              </div>
              <p className="mt-2 text-[14.5px] font-semibold leading-snug text-ink">
                {question.question}
              </p>
              <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-faint">
                {question.why}
              </p>
            </button>
          );
        })}
      </div>

      <Sheet
        open={Boolean(openQuestion)}
        onClose={() => setOpenId(null)}
        title={openQuestion ? openQuestion.category : ""}
      >
        {openQuestion ? (
          <div className="space-y-4 pb-2">
            <h2 className="font-display text-[21px] leading-snug text-ink">
              {openQuestion.question}
            </h2>

            <div className="rounded-2xl bg-mint px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-pine">
                Why they ask this
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-pine">
                {openQuestion.why}
              </p>
            </div>

            <Field
              label="Your answer"
              hint="Say it out loud first, then jot down the points you would use."
            >
              <textarea
                className={`${inputClass} min-h-[104px] resize-none`}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Start with the situation, then what you did, then the result…"
              />
            </Field>

            {revealed ? (
              <>
                <div>
                  <p className="text-[13px] font-semibold text-ink">
                    A structure that works
                  </p>
                  <ol className="mt-2 space-y-2">
                    {openQuestion.structure.map((step, index) => (
                      <li key={step} className="flex gap-2.5">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-[10px] font-bold text-pine">
                          {index + 1}
                        </span>
                        <span className="text-[13px] leading-relaxed text-soft">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-ink">Watch out for</p>
                  <ul className="mt-2 space-y-2">
                    {openQuestion.tips.map((tip) => (
                      <li key={tip} className="flex gap-2.5">
                        <Icon
                          name="close"
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber"
                        />
                        <span className="text-[12.5px] leading-relaxed text-soft">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-line bg-card px-4 py-3.5">
                  <p className="text-[13px] font-semibold text-ink">
                    How confident do you feel now?
                  </p>
                  <p className="mt-0.5 text-[11px] text-faint">
                    Tap a star to save this practice attempt.
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-label={`${value} out of 5`}
                        onClick={() => {
                          setRating(value);
                          recordInterview(openQuestion.id, value);
                        }}
                        className="p-0.5"
                      >
                        <Icon
                          name="star"
                          className={`h-7 w-7 transition ${
                            value <= rating
                              ? "fill-amber text-amber"
                              : "text-line"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 ? (
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-pine">
                      <Icon name="check" className="h-3.5 w-3.5" />
                      Saved. Practise it again whenever you like.
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <Button full onClick={() => setRevealed(true)}>
                Show how to structure it
              </Button>
            )}
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}
