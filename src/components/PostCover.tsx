import Image from "next/image";
import type { Post } from "@/lib/content";
import { PostArt } from "./PostArt";

// A post's cover: the one uploaded in the admin, else its illustration (src/lib/post-art.ts),
// else the category artwork.
// The category rides on the photo as a small label, so a card reads at a glance.
export function PostCover({
  post,
  sizes,
  priority = false,
  large = false,
  chip = true,
  className = "",
}: {
  post: Pick<Post, "cover" | "category">;
  sizes: string;
  priority?: boolean;
  large?: boolean;
  chip?: boolean;
  className?: string;
}) {
  const radius = large ? "rounded-[32px]" : "rounded-[24px]";
  if (!post.cover) return <PostArt category={post.category} large={large} />;
  return (
    <div className={`relative isolate aspect-[16/10] overflow-hidden bg-navy-deep ${radius} ${className}`}>
      <Image
        src={post.cover.url}
        alt={post.cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        style={post.cover.focus ? { objectPosition: post.cover.focus } : undefined}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
      />
      {chip ? (
        <span
          className={`absolute bottom-0 left-0 rounded-tr-[18px] bg-white font-display font-bold text-navy ${large ? "px-5 pb-2 pt-3 text-[15px]" : "px-4 pb-1.5 pt-2.5 text-[13px]"}`}
        >
          {post.category}
        </span>
      ) : null}
    </div>
  );
}
