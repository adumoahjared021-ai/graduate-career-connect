"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import {
  Button,
  PageHeader,
  Progress,
  SectionHeading,
  Sheet,
  Stat,
  Tag,
} from "@/components/ui";
import { courseProgress, prettyDate } from "@/lib/logic";
import { COURSES } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Certificate, Course } from "@/lib/types";

const CATEGORIES = [
  "All",
  "Workplace skills",
  "Digital",
  "Technology",
  "Job search",
];

export default function LearnPage() {
  const { state, completeLesson } = useApp();
  const [category, setCategory] = useState("All");
  const [openCourseId, setOpenCourseId] = useState<string | null>(null);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  const courses =
    category === "All"
      ? COURSES
      : COURSES.filter((course) => course.category === category);

  const lessonsDone = Object.values(state.completed).reduce(
    (total, ids) => total + ids.length,
    0,
  );

  const openCourse = COURSES.find((course) => course.id === openCourseId) ?? null;
  const openLesson =
    openCourse?.lessons.find((lesson) => lesson.id === openLessonId) ?? null;
  const openLessonDone = Boolean(
    openCourse &&
      openLesson &&
      (state.completed[openCourse.id] ?? []).includes(openLesson.id),
  );

  const openCourseSheet = (course: Course) => {
    setOpenCourseId(course.id);
    const nextLesson = course.lessons.find(
      (lesson) => !(state.completed[course.id] ?? []).includes(lesson.id),
    );
    setOpenLessonId(nextLesson?.id ?? null);
  };

  return (
    <div>
      <PageHeader title="Skills centre" eyebrow="Learn and grow" />

      <div className="px-5">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="In progress" value={state.enrolments.length} />
          <Stat label="Lessons done" value={lessonsDone} />
          <Stat label="Certificates" value={state.certificates.length} />
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

      <div className="mt-4 space-y-3 px-5">
        {courses.map((course) => {
          const progress = courseProgress(state, course);
          const minutes = course.lessons.reduce(
            (total, lesson) => total + lesson.minutes,
            0,
          );
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => openCourseSheet(course)}
              className="flex w-full gap-3 rounded-[20px] border border-line bg-card p-4 text-left active:scale-[0.995]"
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] text-white"
                style={{ background: course.color }}
              >
                <Icon name="book" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-faint">
                  {course.category}
                </p>
                <p className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">
                  {course.title}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={progress} />
                  <span className="shrink-0 text-[10.5px] font-semibold text-soft">
                    {progress}%
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-faint">
                  {course.lessons.length} lessons · about {minutes} min ·{" "}
                  {course.level}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {state.certificates.length > 0 ? (
        <section className="mt-7 px-5">
          <SectionHeading title="Your certificates" />
          <div className="space-y-2">
            {state.certificates.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => setCertificate(cert)}
                className="flex w-full items-center gap-3 rounded-[18px] border border-line bg-card p-3.5 text-left"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-soft text-amber">
                  <Icon name="award" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">
                    {cert.title}
                  </p>
                  <p className="text-[11px] text-faint">
                    Awarded {prettyDate(cert.date)}
                  </p>
                </div>
                <Icon name="chevronRight" className="h-4 w-4 text-faint" />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <Sheet
        open={Boolean(openCourse)}
        onClose={() => setOpenCourseId(null)}
        title={openCourse ? openCourse.title : ""}
        footer={
          openCourse ? (
            courseProgress(state, openCourse) === 100 ? (
              <Button
                full
                onClick={() => setOpenLessonId(openCourse.lessons[0].id)}
              >
                Review from the beginning
              </Button>
            ) : openLesson ? (
              <Button
                full
                disabled={openLessonDone}
                onClick={() => completeLesson(openCourse.id, openLesson.id)}
              >
                {openLessonDone ? "Lesson completed" : "Mark lesson complete"}
              </Button>
            ) : (
              <Button
                full
                onClick={() => {
                  const next =
                    openCourse.lessons.find(
                      (lesson) =>
                        !(state.completed[openCourse.id] ?? []).includes(lesson.id),
                    ) ?? openCourse.lessons[0];
                  setOpenLessonId(next.id);
                }}
              >
                {courseProgress(state, openCourse) > 0
                  ? "Continue where I stopped"
                  : "Start the first lesson"}
              </Button>
            )
          ) : null
        }
      >
        {openCourse ? (
          <div className="space-y-4 pb-2">
            <p className="text-[13px] leading-relaxed text-soft">
              {openCourse.blurb}
            </p>

            <div className="flex flex-wrap gap-1.5">
              <Tag>{openCourse.category}</Tag>
              <Tag tone="line">{openCourse.level}</Tag>
              <Tag tone="line">{openCourse.lessons.length} lessons</Tag>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11.5px]">
                <span className="font-semibold text-ink">Your progress</span>
                <span className="text-soft">
                  {courseProgress(state, openCourse)}%
                </span>
              </div>
              <Progress value={courseProgress(state, openCourse)} />
            </div>

            <div className="space-y-2">
              {openCourse.lessons.map((lesson, index) => {
                const done = (state.completed[openCourse.id] ?? []).includes(
                  lesson.id,
                );
                const expanded = openLessonId === lesson.id;
                return (
                  <div
                    key={lesson.id}
                    className={`overflow-hidden rounded-2xl border transition ${
                      expanded
                        ? "border-pine/30 bg-card"
                        : "border-line bg-card"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenLessonId(expanded ? null : lesson.id)
                      }
                      className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                          done
                            ? "bg-pine text-white"
                            : "bg-mint text-pine"
                        }`}
                      >
                        {done ? (
                          <Icon name="check" className="h-3.5 w-3.5" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-semibold leading-snug text-ink">
                          {lesson.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-faint">
                          <Icon name="clock" className="h-3 w-3" />
                          {lesson.minutes} min
                        </span>
                      </span>
                      <Icon
                        name="chevronRight"
                        className={`h-4 w-4 shrink-0 text-faint transition ${
                          expanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {expanded ? (
                      <div className="border-t border-line px-3.5 py-3">
                        <ul className="space-y-2">
                          {lesson.points.map((point) => (
                            <li key={point} className="flex gap-2.5">
                              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                              <span className="text-[12.5px] leading-relaxed text-soft">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 rounded-xl bg-mint px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-pine">
                            Remember this
                          </p>
                          <p className="mt-1 text-[12px] leading-relaxed text-pine">
                            {lesson.takeaway}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {courseProgress(state, openCourse) === 100 ? (
              <div className="flex items-start gap-2.5 rounded-2xl bg-amber-soft px-4 py-3">
                <Icon
                  name="award"
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber"
                />
                <p className="text-[12px] leading-relaxed text-amber">
                  Course finished. Your certificate is saved under “Your
                  certificates” on this page.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Sheet>

      <Sheet
        open={Boolean(certificate)}
        onClose={() => setCertificate(null)}
        title="Certificate"
      >
        {certificate ? (
          <div className="pb-2">
            <div className="rounded-[20px] border-2 border-pine/15 bg-white px-6 py-8 text-center">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.28em] text-amber">
                Certificate of completion
              </p>
              <p className="mt-5 text-[11px] text-soft">This certifies that</p>
              <p className="mt-1 font-display text-[24px] leading-tight text-ink">
                {state.profile?.name ?? "Graduate"}
              </p>
              <p className="mt-4 text-[11px] text-soft">
                has successfully completed
              </p>
              <p className="mt-1 font-display text-[19px] leading-snug text-pine">
                {certificate.title}
              </p>
              <div className="mx-auto mt-6 h-px w-16 bg-line" />
              <p className="mt-4 text-[10.5px] text-faint">
                Graduate Career Connect · {prettyDate(certificate.date)}
              </p>
              <p className="mt-1 text-[10.5px] text-faint">
                Certificate ID {certificate.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <p className="mt-3 text-center text-[11px] text-faint">
              Screenshot this certificate or add it to your portfolio.
            </p>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}
