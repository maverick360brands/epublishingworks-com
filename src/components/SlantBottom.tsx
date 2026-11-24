// Beaver Builder "edge-slant" row shape: a diagonal from top-left to bottom-right,
// filled below the line with the next section's color.
export function SlantBottom({ fill, className = "" }: { fill: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 422 34" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 bottom-0 block h-[50px] w-full md:h-[116px] ${className}`}>
      <polygon points="0,0 422,34 0,34" fill={fill} />
    </svg>
  );
}
