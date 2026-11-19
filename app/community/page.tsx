"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Avatar, Button, PageHeader, Tag } from "@/components/ui";
import { useApp } from "@/lib/store";

const TAGS = ["Job search", "Projects", "Mentorship", "Internships", "General"];

const COLORS = ["#134e45", "#26467e", "#8a4326", "#5b3f8c", "#1f5f7a", "#a03d4a"];

function colorFor(name: string) {
  let total = 0;
  for (let index = 0; index < name.length; index += 1) {
    total += name.charCodeAt(index);
  }
  return COLORS[total % COLORS.length];
}

export default function CommunityPage() {
  const { profile, state, addPost, likePost } = useApp();
  const [body, setBody] = useState("");
  const [tag, setTag] = useState(TAGS[0]);
  const [filter, setFilter] = useState("All");

  if (!profile) return null;

  const posts =
    filter === "All"
      ? state.posts
      : state.posts.filter((post) => post.tag === filter);

  const post = () => {
    addPost(body.trim(), tag);
    setBody("");
  };

  return (
    <div>
      <PageHeader title="Community" eyebrow="Graduates helping graduates" />

      <div className="px-5">
        <div className="rounded-[20px] border border-line bg-card p-3.5">
          <div className="flex gap-2.5">
            <Avatar name={profile.name} color="#134e45" size={34} />
            <textarea
              className="min-h-[44px] flex-1 resize-none bg-transparent pt-1 text-[13px] leading-relaxed text-ink outline-none placeholder:text-faint"
              placeholder="Share an opportunity, ask a question or celebrate a win…"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2.5">
            <select
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11.5px] font-medium text-soft outline-none"
              aria-label="Post category"
            >
              {TAGS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button size="sm" disabled={body.trim().length < 5} onClick={post}>
              Post
            </Button>
          </div>
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {["All", ...TAGS].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition ${
              filter === option
                ? "border-pine bg-pine text-white"
                : "border-line bg-card text-soft"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3 px-5">
        {posts.map((entry) => (
          <article
            key={entry.id}
            className="rounded-[20px] border border-line bg-card p-4"
          >
            <div className="flex items-start gap-3">
              <Avatar
                name={entry.author}
                color={colorFor(entry.author)}
                size={40}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">
                  {entry.author}
                  {entry.mine ? (
                    <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-faint">
                      You
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-[11px] text-faint">{entry.role}</p>
              </div>
              <Tag tone="line">{entry.tag}</Tag>
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-soft">
              {entry.body}
            </p>

            <div className="mt-3 flex items-center gap-4 border-t border-line pt-2.5">
              <button
                type="button"
                onClick={() => likePost(entry.id)}
                aria-pressed={entry.liked}
                className={`inline-flex items-center gap-1.5 text-[12px] font-semibold transition ${
                  entry.liked ? "text-amber" : "text-faint"
                }`}
              >
                <Icon
                  name="heart"
                  className={`h-4 w-4 ${entry.liked ? "fill-amber" : ""}`}
                />
                {entry.likes}
              </button>
              <span className="text-[11px] text-faint">{entry.time}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
