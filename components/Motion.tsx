"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

/**
 * Adds `.in` to every `.reveal` element as it scrolls into view.
 * Elements are only hidden while <html> has the `motion` class, which the inline script in layout.tsx sets
 * (and removes again if this component never runs), so content is always visible without JS or with reduced motion.
 */
export function MotionObserver() {
  useEffect(() => {
    window.__motionReady = true;
    const root = document.documentElement;
    if (!root.classList.contains("motion")) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

const NUM = /^(.*?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

/**
 * Counts a number up from 0 when it scrolls into view. The server renders the final value,
 * so the real number is in the HTML; non-numeric values (e.g. "NSTDA") render as-is.
 */
export function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const m = value.match(NUM);
    const el = ref.current;
    if (!m || !el || !document.documentElement.classList.contains("motion")) return;
    const [, pre, numStr, post] = m;
    const target = parseFloat(numStr.replace(/,/g, ""));
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const commas = numStr.includes(",");
    const fmt = (n: number) => {
      const s = n.toFixed(decimals);
      return commas ? Number(s).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : s;
    };

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setText(pre + fmt(target * eased) + post);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setText(pre + fmt(0) + post);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="tabular-nums">{text}</span>
    </span>
  );
}
