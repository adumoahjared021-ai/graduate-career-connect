export type JobKind = "Job" | "Internship" | "Graduate programme";
export type WorkMode = "On-site" | "Hybrid" | "Remote";

export type Job = {
  id: string;
  title: string;
  company: string;
  sector: string;
  kind: JobKind;
  location: string;
  mode: WorkMode;
  salary: string;
  posted: string;
  deadline: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  verified: boolean;
  color: string;
};

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  points: string[];
  takeaway: string;
};

export type Course = {
  id: string;
  title: string;
  provider: string;
  category: string;
  level: "Beginner" | "Intermediate";
  blurb: string;
  color: string;
  lessons: Lesson[];
};

export type Mentor = {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  bio: string;
  years: number;
  availability: string;
  responseHours: number;
  color: string;
};

export type InterviewQuestion = {
  id: string;
  category: "Competency" | "Behavioural" | "Technical" | "Career";
  question: string;
  why: string;
  structure: string[];
  tips: string[];
};

export type Post = {
  id: string;
  author: string;
  role: string;
  time: string;
  body: string;
  tag: string;
  likes: number;
  liked: boolean;
  mine: boolean;
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  university: string;
  degree: string;
  graduationYear: string;
  headline: string;
  about: string;
  skills: string[];
  interests: string[];
};

export type Application = {
  id: string;
  jobId: string;
  title: string;
  company: string;
  status: "Submitted" | "Under review" | "Interview" | "Offer";
  date: string;
  note: string;
};

export type MentorRequest = {
  id: string;
  mentorId: string;
  mentorName: string;
  topic: string;
  message: string;
  preferred: string;
  status: "Pending" | "Accepted";
  date: string;
};

export type Project = {
  id: string;
  title: string;
  role: string;
  year: string;
  description: string;
  link: string;
  skills: string[];
};

export type Certificate = {
  id: string;
  courseId: string;
  title: string;
  date: string;
};

export type InterviewAttempt = {
  id: string;
  questionId: string;
  score: number;
  date: string;
};

export type CvEntry = {
  id: string;
  heading: string;
  subheading: string;
  period: string;
  details: string;
};

export type CvDraft = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: CvEntry[];
  experience: CvEntry[];
  skills: string[];
  link: string;
};

export type AppState = {
  profile: Profile | null;
  savedJobs: string[];
  applications: Application[];
  mentorRequests: MentorRequest[];
  enrolments: string[];
  completed: Record<string, string[]>;
  certificates: Certificate[];
  projects: Project[];
  posts: Post[];
  interviews: InterviewAttempt[];
  cv: CvDraft | null;
};
