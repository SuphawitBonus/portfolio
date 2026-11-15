import Image from "next/image";
import { CountUp } from "@/components/Motion";
import { FlipMetric, ProjectMedia, ProjectTabs } from "@/components/ProjectBits";
import { moreWork, profile, projects, skills, type Link, type Project } from "@/lib/content";

/* ---------- small building blocks ---------- */

const d = (ms = 0) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

function Ext({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

/** Frosted card that rises into view. Kept few and large: one card per idea, not per fact. */
function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`card reveal p-6 sm:p-8 ${className}`} style={d(delay)}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-muted">{children}</p>;
}

/** Gauge for a true share of a whole (0–100); it draws from zero when revealed. */
function Ring({ value, display, id, size = 84 }: { value: number; display: string; id: string; size?: number }) {
  const stroke = size * 0.1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <circle
          className="ring-arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c - (value / 100) * c}
          style={{ "--c": c } as React.CSSProperties}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-lg font-bold tracking-tight">
        <CountUp value={display} duration={1400} />
      </span>
    </div>
  );
}

const pill = "rounded-full px-4 py-2 text-sm font-semibold transition-colors";

function LinkRow({ links }: { links: Link[] }) {
  if (links.length === 0) return null;
  return (
    <p className="flex flex-wrap gap-2">
      {links.map((l, i) => (
        <Ext key={l.href} href={l.href} className={`${pill} ${i === 0 ? "bg-accent text-accent-ink hover:opacity-90" : "bg-chip text-ink hover:bg-[var(--track)]"}`}>
          {l.label} <span aria-hidden className="nudge">↗</span>
        </Ext>
      ))}
    </p>
  );
}

function SectionTitle({ id, first, second }: { id: string; first: string; second: string }) {
  return (
    <h2 id={id} className="reveal scroll-mt-6 pb-8 pt-28 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
      {first} <span className="text-accent">{second}</span>
    </h2>
  );
}

const COLS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

/* ---------- project: clip · summary · one details card ---------- */

function BuiltList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-3">
      {items.map((b) => (
        <li key={b} className="flex gap-3">
          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectBlock({ p, index }: { p: Project; index: number }) {
  const flip = index % 2 === 1;
  const live = p.links[0];
  return (
    <article id={p.id} aria-labelledby={`${p.id}-title`} className="grid scroll-mt-20 grid-cols-1 gap-4 lg:grid-cols-12">
      {/* clip */}
      <div className={`card reveal flex p-2.5 lg:col-span-7 ${flip ? "lg:order-2" : ""}`} style={d(0)}>
        {p.video ? (
          <ProjectMedia video={p.video} image={p.image} liveHref={live.href} priority={index === 0} />
        ) : (
          <Ext href={live.href} className="relative block aspect-[16/10] w-full overflow-hidden rounded-[1.1rem]">
            <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width: 1024px) 700px, 100vw" className="shot-img object-cover object-left-top" />
          </Ext>
        )}
      </div>

      {/* summary */}
      <Card delay={90} className={`flex flex-col lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p className="text-sm text-muted">
          <span className="font-mono">{String(index + 1).padStart(2, "0")}</span> · {p.role} · {p.year}
        </p>
        <h3 id={`${p.id}-title`} className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {p.title}
        </h3>
        {p.thai && <p className="mt-1 text-sm text-muted" lang="th">{p.thai}</p>}
        <p className="mt-3 text-lg font-medium">{p.tagline}</p>
        <p className="mt-3 text-muted">{p.problem}</p>
        <div className="mt-auto pt-6">
          <LinkRow links={p.links} />
        </div>
      </Card>

      {/* one card: numbers, then what I built + limits */}
      <Card delay={140} className={`lg:order-3 lg:col-span-12`}>
        <div className={`grid grid-cols-2 gap-x-6 gap-y-8 ${COLS[p.proof.length] ?? "lg:grid-cols-4"}`}>
          {p.proof.map((m, i) => (
            <FlipMetric
              key={m.label}
              delay={180 + i * 60}
              label={`${m.value} ${m.label}`}
              how={m.how}
              evidence={m.evidence}
              front={
                m.ring !== undefined ? (
                  <div className="flex items-center gap-4">
                    <Ring value={m.ring} display={m.value} id={`${p.id}-ring-${i}`} />
                    <p className="text-sm text-muted">{m.label}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                      <CountUp value={m.value} />
                    </p>
                    <p className="mt-1 text-sm text-muted">{m.label}</p>
                  </div>
                )
              }
            />
          ))}
        </div>

        <div className="mt-8 grid gap-8 border-t border-[var(--track)] pt-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="hidden lg:block">
              <Label>What I built</Label>
              <BuiltList items={p.built} />
            </div>
            <details className="lg:hidden">
              <summary className="built-summary flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-muted">What I built · {p.built.length} points</span>
                <svg aria-hidden viewBox="0 0 16 16" className="built-chevron h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <BuiltList items={p.built} />
            </details>
          </div>
          <div className="lg:col-span-4">
            <Label>Limits</Label>
            <p className="mt-3">{p.limits}</p>
            <p className="mt-4 text-sm text-muted">{p.stack.join(" · ")}</p>
          </div>
        </div>
      </Card>
    </article>
  );
}

/* ---------- page ---------- */

export default function Home() {
  return (
    <>
      <a href="#work" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-card-solid focus:px-4 focus:py-2">
        Skip to work
      </a>

      <header className="site-header mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <a href="#top" className="text-sm font-bold tracking-tight">
          suphawit<span className="text-accent">.</span>
        </a>
        <nav aria-label="Sections" className="flex gap-1 text-sm font-medium">
          {[
            ["#work", "Work"],
            ["#skills", "Skills"],
            ["#contact", "Contact"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full px-3.5 py-1.5 transition-colors hover:bg-chip">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* ---------- hero: intro · internship · one stats strip ---------- */}
        <section aria-labelledby="hero-title" className="grid gap-4 pt-6 lg:grid-cols-12">
          <Card className="flex flex-col justify-between gap-10 lg:col-span-8">
            <p className="text-sm text-muted">{profile.school}</p>
            <div>
              <h1 id="hero-title" className="text-[clamp(3rem,8.5vw,6rem)] font-bold leading-[0.95] tracking-tight">
                <span className="line">
                  <span style={d(150)}>Suphawit</span>
                </span>
                <span className="line">
                  <span style={d(280)} className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                    Thammarat
                  </span>
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted">
                I build web apps that know what they don&apos;t know: from raw government data or a legal text to a tested, live
                product that says clearly where its answers stop.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {profile.cv.map((c, i) => (
                <a key={c.href} href={c.href} className={`${pill} px-5 py-2.5 ${i === 0 ? "bg-ink text-[var(--sky-1)] hover:opacity-90" : "bg-chip hover:bg-[var(--track)]"}`}>
                  {c.label} <span aria-hidden className="nudge nudge-down">↓</span>
                </a>
              ))}
              <Ext href={profile.github} className={`${pill} hover:bg-chip`}>GitHub</Ext>
              <Ext href={profile.linkedin} className={`${pill} hover:bg-chip`}>LinkedIn</Ext>
            </div>
          </Card>

          <Card delay={120} className="flex flex-col justify-between gap-8 lg:col-span-4">
            <div>
              <Label>Open to internships</Label>
              <p className="mt-4 text-2xl font-medium leading-snug">
                Looking for a <b className="font-bold">frontend</b>, <b className="font-bold">full-stack</b> or <b className="font-bold">data</b> internship.
              </p>
              <p className="mt-4 text-muted">Based in {profile.location}.</p>
            </div>
            <a href={`mailto:${profile.email}`} className={`${pill} w-fit bg-accent text-accent-ink hover:opacity-90`}>
              Email me <span aria-hidden className="nudge">→</span>
            </a>
          </Card>

          <Card delay={200} className="lg:col-span-12">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
              <div>
                <dt className="text-sm text-muted">Live web apps</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight"><CountUp value="4" duration={900} /></dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Recognition</dt>
                <dd className="mt-1 font-semibold">NSC 2026 regional round</dd>
                <dd className="text-sm text-muted">NSTDA development grant</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Now</dt>
                <dd className="mt-1 font-semibold">KGI ALGO Trading 2026</dd>
                <dd className="text-sm text-muted">Solo entrant, ongoing</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Leadership</dt>
                <dd className="mt-1 font-semibold"><CountUp value="฿484,600" /> managed</dd>
                <dd className="text-sm text-muted">Treasurer, ICT Student Union</dd>
              </div>
            </dl>
          </Card>
        </section>

        {/* ---------- work ---------- */}
        <section aria-labelledby="work">
          <SectionTitle id="work" first="Selected" second="work" />
          <ProjectTabs items={projects.map((p) => ({ id: p.id, title: p.title }))} />
          <div className="space-y-20">
            {projects.map((p, i) => (
              <ProjectBlock key={p.id} p={p} index={i} />
            ))}
          </div>
        </section>

        {/* ---------- also: one card, three columns ---------- */}
        <section aria-labelledby="more">
          <SectionTitle id="more" first="Also" second="building" />
          <Card>
            <div className="grid gap-10 md:grid-cols-3">
              {moreWork.map((w) => (
                <div key={w.title} className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{w.title}</h3>
                    <p className="text-sm text-muted">{w.note}</p>
                  </div>
                  <p>{w.text}</p>
                  <div className="mt-auto">
                    <LinkRow links={w.links} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ---------- skills: one card, plain rows ---------- */}
        <section aria-labelledby="skills">
          <SectionTitle id="skills" first="Tools" second="I use" />
          <Card>
            <dl className="divide-y divide-[var(--track)]">
              {skills.map((s) => (
                <div key={s.group} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr]">
                  <dt className="text-sm font-medium text-muted">{s.group}</dt>
                  <dd>{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </section>
      </main>

      {/* ---------- contact ---------- */}
      <footer id="contact" className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-8">
        <div className="reveal rounded-[1.75rem] bg-gradient-to-br from-[#0e1a3a] via-[#15307f] to-[#2b5fd9] p-8 text-white sm:p-12" style={d(0)}>
          <p className="text-sm font-medium text-white/80">Contact</p>
          <h2 className="mt-3 text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[1.05] tracking-tight">Let&apos;s talk about an internship.</h2>
          <p className="mt-8">
            <a href={`mailto:${profile.email}`} className="break-all text-lg font-semibold underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white sm:text-2xl">
              {profile.email}
            </a>
          </p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Ext href={profile.github} className="underline decoration-white/40 underline-offset-4 hover:decoration-white">GitHub</Ext>
            <Ext href={profile.linkedin} className="underline decoration-white/40 underline-offset-4 hover:decoration-white">LinkedIn</Ext>
            {profile.cv.map((c) => (
              <a key={c.href} href={c.href} className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
                {c.label}
              </a>
            ))}
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          No analytics, no cookies. Built with Next.js 16 and Tailwind CSS ·{" "}
          <Ext href="https://github.com/SuphawitBonus/portfolio" className="underline underline-offset-4 hover:text-accent">source</Ext>
        </p>
      </footer>
    </>
  );
}
