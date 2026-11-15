import Image from "next/image";
import { moreWork, profile, projects, skills, type Link, type Project } from "@/lib/content";

function Ext({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function LinkRow({ links }: { links: Link[] }) {
  if (links.length === 0) return null;
  return (
    <p className="flex flex-wrap gap-x-5 gap-y-1">
      {links.map((l) => (
        <Ext
          key={l.href}
          href={l.href}
          className="font-medium text-accent underline decoration-1 underline-offset-4 hover:decoration-2"
        >
          {l.label} <span aria-hidden>↗</span>
        </Ext>
      ))}
    </p>
  );
}

function SectionHead({ id, title, count }: { id: string; title: string; count?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-ink pb-3">
      <h2 id={id} className="font-serif text-3xl sm:text-4xl">
        {title}
      </h2>
      {count && <span className="font-mono text-sm text-muted">{count}</span>}
    </div>
  );
}

function ProjectBlock({ p, index }: { p: Project; index: number }) {
  const flip = index % 2 === 1;
  const live = p.links[0];
  return (
    <article aria-labelledby={`${p.id}-title`} className="grid gap-8 py-14 lg:grid-cols-12 lg:gap-12">
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Ext href={live.href} className="group block">
          <Image
            src={p.image.src}
            alt={p.image.alt}
            width={1440}
            height={900}
            sizes="(min-width: 1024px) 680px, 100vw"
            priority={index === 0}
            className="w-full rounded-md border border-shot transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none"
          />
        </Ext>
        <p className="mt-3 font-mono text-[13px] text-muted">{p.stack.join(" · ")}</p>
      </div>

      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p className="font-mono text-sm text-muted">
          {String(index + 1).padStart(2, "0")} · {p.role} · {p.year}
        </p>
        <h3 id={`${p.id}-title`} className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">
          {p.title}
          {p.thai && <span className="ml-3 align-middle font-sans text-base text-muted">{p.thai}</span>}
        </h3>
        <p className="mt-3 text-lg">{p.tagline}</p>

        <p className="mt-6 text-muted">{p.problem}</p>

        <ul className="mt-5 space-y-3">
          {p.built.map((b) => (
            <li key={b} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent">
              {b}
            </li>
          ))}
        </ul>

        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
          {p.proof.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd className="font-mono text-2xl font-medium text-accent">{m.value}</dd>
              <dd className="text-sm text-muted">{m.label}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-sm">
          <span className="font-mono text-[13px] uppercase tracking-wider text-muted">Limits · </span>
          {p.limits}
        </p>

        <div className="mt-6">
          <LinkRow links={p.links} />
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <a href="#work" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-surface focus:px-3 focus:py-2">
        Skip to work
      </a>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <a href="#top" className="font-mono text-sm font-medium">
          suphawit<span className="text-accent">.</span>
        </a>
        <nav aria-label="Sections" className="flex gap-5 text-sm sm:gap-7">
          <a href="#work" className="hover:text-accent">Work</a>
          <a href="#skills" className="hover:text-accent">Skills</a>
          <a href="#contact" className="hover:text-accent">Contact</a>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="pb-20 pt-14 sm:pt-24">
          <p className="font-mono text-sm text-muted">
            {profile.name} · {profile.school}
          </p>
          <h1 id="hero-title" className="mt-5 max-w-4xl font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[1.02] tracking-tight">
            I build web apps that <em className="text-accent">know what they don&apos;t know.</em>
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-muted sm:text-xl">
            I take projects from raw government data or a legal text all the way to a tested, live web app, and I make each one say
            clearly where its answers stop. Looking for a frontend, full-stack or data internship.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {profile.cv.map((c, i) => (
              <a
                key={c.href}
                href={c.href}
                className={
                  i === 0
                    ? "rounded-full bg-accent px-5 py-2.5 font-medium text-accent-ink hover:opacity-90"
                    : "rounded-full border border-ink px-5 py-2.5 font-medium hover:bg-ink hover:text-paper"
                }
              >
                {c.label} <span aria-hidden>↓</span>
              </a>
            ))}
            <span className="flex gap-5 pl-2 text-sm">
              <Ext href={profile.github} className="underline decoration-1 underline-offset-4 hover:text-accent">GitHub</Ext>
              <Ext href={profile.linkedin} className="underline decoration-1 underline-offset-4 hover:text-accent">LinkedIn</Ext>
              <a href={`mailto:${profile.email}`} className="underline decoration-1 underline-offset-4 hover:text-accent">Email</a>
            </span>
          </div>

          <dl className="mt-16 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[13px] uppercase tracking-wider text-muted">Shipped</dt>
              <dd className="mt-1">4 live web apps on Vercel</dd>
            </div>
            <div>
              <dt className="font-mono text-[13px] uppercase tracking-wider text-muted">Recognition</dt>
              <dd className="mt-1">NSC 2026 regional round · NSTDA grant</dd>
            </div>
            <div>
              <dt className="font-mono text-[13px] uppercase tracking-wider text-muted">Based in</dt>
              <dd className="mt-1">{profile.location}</dd>
            </div>
          </dl>
        </section>

        {/* Work */}
        <section aria-labelledby="work" className="scroll-mt-6">
          <SectionHead id="work" title="Selected work" count={String(projects.length).padStart(2, "0")} />
          <div className="divide-y divide-line">
            {projects.map((p, i) => (
              <ProjectBlock key={p.id} p={p} index={i} />
            ))}
          </div>
        </section>

        {/* More */}
        <section aria-labelledby="more" className="mt-10 scroll-mt-6">
          <SectionHead id="more" title="Also" />
          <div className="grid gap-10 py-10 md:grid-cols-3">
            {moreWork.map((w) => (
              <div key={w.title}>
                <h3 className="text-lg font-semibold">{w.title}</h3>
                <p className="font-mono text-[13px] text-muted">{w.note}</p>
                <p className="mt-3">{w.text}</p>
                <div className="mt-3">
                  <LinkRow links={w.links} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section aria-labelledby="skills" className="mt-10 scroll-mt-6">
          <SectionHead id="skills" title="Tools I use" />
          <dl className="divide-y divide-line">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
                <dt className="font-mono text-sm text-muted">{s.group}</dt>
                <dd>{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* Contact */}
      <footer id="contact" className="mt-24 border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <p className="font-mono text-sm text-muted">Contact</p>
          <h2 className="mt-3 font-serif text-[clamp(2.25rem,6vw,4.5rem)] leading-tight">
            Let&apos;s talk about an internship.
          </h2>
          <p className="mt-6">
            <a
              href={`mailto:${profile.email}`}
              className="break-all text-lg font-medium text-accent underline decoration-1 underline-offset-4 hover:decoration-2 sm:text-2xl"
            >
              {profile.email}
            </a>
          </p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Ext href={profile.github} className="underline decoration-1 underline-offset-4 hover:text-accent">GitHub</Ext>
            <Ext href={profile.linkedin} className="underline decoration-1 underline-offset-4 hover:text-accent">LinkedIn</Ext>
            {profile.cv.map((c) => (
              <a key={c.href} href={c.href} className="underline decoration-1 underline-offset-4 hover:text-accent">
                {c.label}
              </a>
            ))}
          </p>
          <p className="mt-14 text-sm text-muted">
            No analytics, no cookies. Built with Next.js 16 and Tailwind CSS ·{" "}
            <Ext href="https://github.com/SuphawitBonus/portfolio" className="underline underline-offset-4 hover:text-accent">
              source
            </Ext>
          </p>
        </div>
      </footer>
    </>
  );
}
