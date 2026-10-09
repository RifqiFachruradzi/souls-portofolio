type LeafMarkProps = { className?: string; size?: number };

/** A small hand-drawn leaf-and-spiral mark, a nod to the Hidden Leaf. */
export function LeafMark({ className = "", size = 16 }: LeafMarkProps) {
  return (
    <svg
      className={`leaf-mark${className ? ` ${className}` : ""}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12.2 10.6A9 9 0 1 0 22.8 9" />
      <path d="M22.8 9a6.2 6.2 0 0 1 .6 9.4 4.6 4.6 0 0 1-6.6-.4 3 3 0 0 1 .6-4.2 1.8 1.8 0 0 1 2.4.6" />
      <path d="M12.2 10.6 4 3.5l11.5 3.8" />
    </svg>
  );
}
