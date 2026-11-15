"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Link = { label: string; href: string };

const RM = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(RM);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(RM).matches,
    () => false,
  );
}

/* ---------- metric card that flips to show how the number was measured ---------- */

export function FlipMetric({
  front,
  label,
  how,
  evidence,
  delay = 0,
}: {
  front: React.ReactNode;
  label: string;
  how: string;
  evidence?: Link;
  delay?: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const backFirstRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const moved = useRef(false);

  // Keep keyboard focus on the visible face after flipping.
  useEffect(() => {
    if (!moved.current) return;
    (flipped ? backFirstRef.current : openRef.current)?.focus();
  }, [flipped]);

  const flip = (v: boolean) => {
    moved.current = true;
    setFlipped(v);
  };

  // A plain cell: it sits inside one shared metrics card, so there is no box of its own.
  return (
    <div className="reveal min-w-0" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <div className="flip" data-flipped={flipped}>
        <div className="face face-front relative pr-8" inert={flipped}>
          {front}
          <button
            ref={openRef}
            type="button"
            onClick={() => flip(true)}
            aria-label={`How was "${label}" measured?`}
            title="How was this measured?"
            className="absolute right-0 top-0 grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-chip hover:text-accent"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 7.2v4M8 4.8v.01" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="face face-back flex flex-col gap-2.5" inert={!flipped} aria-hidden={!flipped}>
          <p className="text-[13px] font-medium text-muted">How it was measured</p>
          <p className="text-sm leading-relaxed">{how}</p>
          <div className="mt-auto flex flex-wrap items-center gap-2">
            {evidence ? (
              <a
                ref={(el) => {
                  backFirstRef.current = el;
                }}
                href={evidence.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-3 py-1.5 text-[13px] font-semibold text-accent-ink hover:opacity-90"
              >
                {evidence.label} <span aria-hidden>↗</span>
              </a>
            ) : (
              <span className="text-[13px] text-muted">Not publicly linkable</span>
            )}
            <button
              ref={(el) => {
                if (!evidence) backFirstRef.current = el;
              }}
              type="button"
              onClick={() => flip(false)}
              className="rounded-full bg-chip px-3 py-1.5 text-[13px] font-semibold hover:bg-[var(--track)]"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- silent clip that plays only while on screen, with a pause control ---------- */

export function ProjectMedia({
  video,
  image,
  liveHref,
  priority = false,
}: {
  video: { webm: string; mp4: string; poster: string };
  image: { src: string; alt: string };
  liveHref: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // `playing` mirrors the element's own play/pause events.
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return; // reduced motion: never autoplay, the visitor can press play
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };
  const paused = !playing;

  return (
    <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] bg-[var(--track)] lg:aspect-auto">
      <video
        ref={ref}
        className="shot-img absolute inset-0 h-full w-full object-cover object-left-top"
        poster={video.poster}
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={image.alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Play clip" : "Pause clip"}
        className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-[var(--card-solid)]/90 text-ink shadow transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:opacity-80"
      >
        {paused ? (
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M4 2.8v10.4L13 8z" /></svg>
        ) : (
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" /></svg>
        )}
      </button>
      {reduced && paused && (
        <span className="pointer-events-none absolute bottom-3 left-14 rounded-full bg-[var(--card-solid)]/90 px-2.5 py-1 text-[13px] font-medium shadow">
          Play the clip
        </span>
      )}

      <a
        href={liveHref}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 rounded-full bg-[var(--card-solid)]/90 px-3 py-1.5 text-[13px] font-semibold shadow transition-opacity focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        Open live <span aria-hidden>↗</span>
      </a>
    </div>
  );
}

/* ---------- sticky project switcher that follows the scroll ---------- */

export function ProjectTabs({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Projects" className="sticky top-3 z-30 mb-8 flex justify-center">
      <ol className="card flex max-w-full gap-1 overflow-x-auto rounded-full p-1 text-sm font-medium [scrollbar-width:none]">
        {items.map((it, i) => {
          const on = it.id === active;
          return (
            <li key={it.id} className="shrink-0">
              <a
                href={`#${it.id}`}
                aria-current={on ? "true" : undefined}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors ${on ? "bg-ink text-[var(--sky-1)]" : "hover:bg-chip"}`}
              >
                <span className={`font-mono text-[13px] ${on ? "" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`${on ? "inline" : "hidden"} sm:inline`}>{it.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
