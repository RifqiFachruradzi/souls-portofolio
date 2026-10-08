import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = { as?: ElementType; className?: string; delay?: number; children: ReactNode };

/** Fades its children in the first time they scroll into view. */
export function Reveal({ as: Tag = "div", className = "", delay = 0, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setShown(true);
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? " is-shown" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
