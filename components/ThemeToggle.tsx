"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const DARK_MQ = "(prefers-color-scheme: dark)";

/** The theme in effect: the visitor's saved choice (data-theme on <html>) or, without one, the OS setting. */
function current(): Theme {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return window.matchMedia(DARK_MQ).matches ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia(DARK_MQ);
  mq.addEventListener("change", cb);
  window.addEventListener("themechange", cb);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener("themechange", cb);
  };
}

export function ThemeToggle() {
  // null on the server: the real theme is only known in the browser (set before paint by the script in layout.tsx).
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);
  const dark = theme === "dark";

  const toggle = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm) {
      root.classList.add("theme-switching");
      window.setTimeout(() => root.classList.remove("theme-switching"), 400);
    }
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode or blocked storage: the choice simply isn't remembered */
    }
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme ? `Switch to ${dark ? "light" : "dark"} mode` : "Switch colour theme"}
      title={theme ? `Switch to ${dark ? "light" : "dark"} mode` : undefined}
      data-dark={theme ? String(dark) : undefined}
      className="theme-toggle relative grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-chip"
    >
      {/* sun */}
      <svg aria-hidden viewBox="0 0 24 24" className="icon-sun absolute h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* moon */}
      <svg aria-hidden viewBox="0 0 24 24" className="icon-moon absolute h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
      </svg>
    </button>
  );
}
