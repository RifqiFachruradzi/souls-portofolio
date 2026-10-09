type FrogMarkProps = { className?: string; size?: number };

/** A small toad face, a nod to the summoning toads of Mount Myōboku. */
export function FrogMark({ className = "", size = 22 }: FrogMarkProps) {
  return (
    <svg
      className={`frog-mark${className ? ` ${className}` : ""}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      {/* eyes sit on top of the head */}
      <circle cx="9.5" cy="10" r="5.5" fill="currentColor" />
      <circle cx="22.5" cy="10" r="5.5" fill="currentColor" />
      {/* head */}
      <path d="M3 19c0-5 5.8-8 13-8s13 3 13 8-5.8 9-13 9S3 24 3 19Z" fill="currentColor" />
      {/* pupils */}
      <circle cx="9.5" cy="10" r="3" fill="#fff4e6" />
      <circle cx="22.5" cy="10" r="3" fill="#fff4e6" />
      <rect x="8.6" y="8.2" width="1.8" height="3.6" rx="0.9" fill="#1b130c" />
      <rect x="21.6" y="8.2" width="1.8" height="3.6" rx="0.9" fill="#1b130c" />
      {/* grin and cheeks */}
      <path d="M8.5 20.5c2.2 2.6 4.7 3.6 7.5 3.6s5.3-1 7.5-3.6" fill="none" stroke="#3a1d0c" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="7" cy="18.6" r="1.6" fill="#ff9e80" opacity="0.8" />
      <circle cx="25" cy="18.6" r="1.6" fill="#ff9e80" opacity="0.8" />
    </svg>
  );
}
