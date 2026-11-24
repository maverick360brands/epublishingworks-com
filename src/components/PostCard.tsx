import Link from "next/link";
import type { Post } from "@/lib/content";
import { PostCover } from "./PostCover";

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export function PostCard({ post, headingLevel = "h3" }: { post: Post; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Link href={`/blog/${post.slug}/`} className="group block no-underline">
      <PostCover post={post} decorative sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
      <p className="mt-5 text-[14px] text-body">
        {post.date ? <time dateTime={post.date}>{fmt(post.date)}</time> : null}
        <span aria-hidden="true"> &nbsp;/&nbsp; </span>
        {post.readingMinutes} min read
      </p>
      <H className="mt-2 text-balance font-display text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-navy transition-colors group-hover:text-blue">
        {post.title}
      </H>
      <p className="mt-2 line-clamp-2 text-[16px] leading-[1.55] text-body">{post.description}</p>
    </Link>
  );
}
