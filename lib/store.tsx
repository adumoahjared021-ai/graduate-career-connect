"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { COURSES, SEED_POSTS, SEED_PROJECTS } from "./seed";
import { today, uid } from "./logic";
import type {
  AppState,
  Application,
  CvDraft,
  InterviewAttempt,
  Job,
  Mentor,
  MentorRequest,
  Post,
  Profile,
  Project,
} from "./types";

const STORAGE_KEY = "graduate-career-connect.state.v1";

function buildInitialState(): AppState {
  return {
    profile: null,
    savedJobs: [],
    applications: [],
    mentorRequests: [],
    enrolments: [],
    completed: {},
    certificates: [],
    projects: SEED_PROJECTS.map((project) => ({ ...project })),
    posts: SEED_POSTS.map((post) => ({ ...post })),
    interviews: [],
    cv: null,
  };
}

export function emptyCv(profile: Profile): CvDraft {
  return {
    fullName: profile.name,
    title: profile.headline || profile.degree,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    summary: profile.about,
    education: [
      {
        id: uid(),
        heading: profile.university,
        subheading: profile.degree,
        period: `Graduated ${profile.graduationYear}`,
        details: "",
      },
    ],
    experience: [],
    skills: profile.skills,
    link: "",
  };
}

type Store = {
  ready: boolean;
  state: AppState;
  profile: Profile | null;
  saveProfile: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  toggleSavedJob: (jobId: string) => void;
  applyToJob: (job: Job, note: string) => void;
  requestMentor: (
    mentor: Mentor,
    request: { topic: string; message: string; preferred: string },
  ) => void;
  enrol: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  removeProject: (projectId: string) => void;
  addPost: (body: string, tag: string) => void;
  likePost: (postId: string) => void;
  recordInterview: (questionId: string, score: number) => void;
  saveCv: (draft: CvDraft) => void;
  resetAll: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        const base = buildInitialState();
        setState({
          ...base,
          ...parsed,
          projects: parsed.projects?.length ? parsed.projects : base.projects,
          posts: parsed.posts?.length ? parsed.posts : base.posts,
          cv: parsed.cv ?? null,
        });
      } else {
        setState(buildInitialState());
      }
    } catch {
      setState(buildInitialState());
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be full or blocked; the app keeps working in memory.
    }
  }, [state]);

  const update = useCallback((change: (current: AppState) => AppState) => {
    setState((current) => (current ? change(current) : current));
  }, []);

  const saveProfile = useCallback(
    (profile: Profile) => {
      update((current) => ({ ...current, profile }));
    },
    [update],
  );

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      update((current) =>
        current.profile
          ? { ...current, profile: { ...current.profile, ...patch } }
          : current,
      );
    },
    [update],
  );

  const toggleSavedJob = useCallback(
    (jobId: string) => {
      update((current) => ({
        ...current,
        savedJobs: current.savedJobs.includes(jobId)
          ? current.savedJobs.filter((id) => id !== jobId)
          : [...current.savedJobs, jobId],
      }));
    },
    [update],
  );

  const applyToJob = useCallback(
    (job: Job, note: string) => {
      update((current) => {
        if (current.applications.some((entry) => entry.jobId === job.id)) {
          return current;
        }
        const application: Application = {
          id: uid(),
          jobId: job.id,
          title: job.title,
          company: job.company,
          status: "Submitted",
          date: today(),
          note,
        };
        return { ...current, applications: [application, ...current.applications] };
      });
    },
    [update],
  );

  const requestMentor = useCallback(
    (
      mentor: Mentor,
      request: { topic: string; message: string; preferred: string },
    ) => {
      update((current) => {
        if (current.mentorRequests.some((entry) => entry.mentorId === mentor.id)) {
          return current;
        }
        const entry: MentorRequest = {
          id: uid(),
          mentorId: mentor.id,
          mentorName: mentor.name,
          topic: request.topic,
          message: request.message,
          preferred: request.preferred,
          status: "Pending",
          date: today(),
        };
        return { ...current, mentorRequests: [entry, ...current.mentorRequests] };
      });
    },
    [update],
  );

  const enrol = useCallback(
    (courseId: string) => {
      update((current) =>
        current.enrolments.includes(courseId)
          ? current
          : { ...current, enrolments: [...current.enrolments, courseId] },
      );
    },
    [update],
  );

  const completeLesson = useCallback(
    (courseId: string, lessonId: string) => {
      update((current) => {
        const done = new Set(current.completed[courseId] ?? []);
        if (done.has(lessonId)) return current;
        done.add(lessonId);
        const course = COURSES.find((item) => item.id === courseId);
        const finished = course
          ? course.lessons.every((lesson) => done.has(lesson.id))
          : false;
        const alreadyCertified = current.certificates.some(
          (certificate) => certificate.courseId === courseId,
        );
        return {
          ...current,
          enrolments: current.enrolments.includes(courseId)
            ? current.enrolments
            : [...current.enrolments, courseId],
          completed: { ...current.completed, [courseId]: [...done] },
          certificates:
            finished && !alreadyCertified && course
              ? [
                  ...current.certificates,
                  {
                    id: uid(),
                    courseId,
                    title: course.title,
                    date: today(),
                  },
                ]
              : current.certificates,
        };
      });
    },
    [update],
  );

  const addProject = useCallback(
    (project: Omit<Project, "id">) => {
      update((current) => ({
        ...current,
        projects: [{ ...project, id: uid() }, ...current.projects],
      }));
    },
    [update],
  );

  const removeProject = useCallback(
    (projectId: string) => {
      update((current) => ({
        ...current,
        projects: current.projects.filter((project) => project.id !== projectId),
      }));
    },
    [update],
  );

  const addPost = useCallback(
    (body: string, tag: string) => {
      update((current) => {
        const post: Post = {
          id: uid(),
          author: current.profile?.name ?? "You",
          role: current.profile
            ? `${current.profile.degree}, ${current.profile.university}`
            : "Graduate",
          time: "Just now",
          body,
          tag,
          likes: 0,
          liked: false,
          mine: true,
        };
        return { ...current, posts: [post, ...current.posts] };
      });
    },
    [update],
  );

  const likePost = useCallback(
    (postId: string) => {
      update((current) => ({
        ...current,
        posts: current.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
            : post,
        ),
      }));
    },
    [update],
  );

  const recordInterview = useCallback(
    (questionId: string, score: number) => {
      update((current) => {
        const attempt: InterviewAttempt = {
          id: uid(),
          questionId,
          score,
          date: today(),
        };
        return { ...current, interviews: [attempt, ...current.interviews] };
      });
    },
    [update],
  );

  const saveCv = useCallback(
    (draft: CvDraft) => {
      update((current) => ({ ...current, cv: draft }));
    },
    [update],
  );

  const resetAll = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(buildInitialState());
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready: state !== null,
      state: state ?? buildInitialState(),
      profile: state?.profile ?? null,
      saveProfile,
      updateProfile,
      toggleSavedJob,
      applyToJob,
      requestMentor,
      enrol,
      completeLesson,
      addProject,
      removeProject,
      addPost,
      likePost,
      recordInterview,
      saveCv,
      resetAll,
    }),
    [
      state,
      saveProfile,
      updateProfile,
      toggleSavedJob,
      applyToJob,
      requestMentor,
      enrol,
      completeLesson,
      addProject,
      removeProject,
      addPost,
      likePost,
      recordInterview,
      saveCv,
      resetAll,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useApp(): Store {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return store;
}
