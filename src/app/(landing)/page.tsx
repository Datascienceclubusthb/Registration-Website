import Link from 'next/link';
import { ArrowDown, ArrowRight, CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#10120f] text-[#f6f6ef]">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(ellipse_at_78%_18%,rgba(198,243,106,0.13),transparent_34%),radial-gradient(ellipse_at_0%_75%,rgba(91,108,70,0.13),transparent_32%)]" />
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="#top" className="flex items-center gap-3" aria-label={`${siteConfig.organization} home`}>
          <span className="grid size-11 place-items-center rounded-xl bg-[var(--accent)] text-sm font-black tracking-tight text-[#171b11]">{siteConfig.mark}</span>
          <span className="text-sm font-semibold tracking-wide sm:text-base">{siteConfig.organization}</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/65 md:flex">
          {siteConfig.links.map((link) => <a key={link.href} className="transition hover:text-white" href={link.href}>{link.label}</a>)}
        </nav>
        <a href="#register" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#151711] transition hover:bg-[var(--accent)]">Save your spot <ArrowRight className="ml-1 inline size-4" /></a>
      </header>

      <section id="top" className="relative z-10 mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-12 lg:pb-32 lg:pt-20">
        <div className="max-w-3xl">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"><span className="size-1.5 rounded-full bg-[var(--accent)]" />{siteConfig.eyebrow}</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-7xl lg:text-[5.6rem]">{siteConfig.headline}</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">{siteConfig.description}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#register" className="rounded-full bg-[var(--accent)] px-7 py-4 text-sm font-bold text-[#171b11] transition hover:scale-[1.02]">Register now <ArrowRight className="ml-2 inline size-4" /></a>
            <a href="#about" className="px-4 py-3 text-sm font-medium text-white/70 transition hover:text-white">Get to know us <ArrowDown className="ml-2 inline size-4" /></a>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-sm text-white/60">
            <span className="flex items-center gap-2"><CalendarDays className="size-4 text-[var(--accent)]" />{siteConfig.date}</span>
            <span className="flex items-center gap-2"><MapPin className="size-4 text-[var(--accent)]" />{siteConfig.location}</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative aspect-[.9] overflow-hidden rounded-[2rem] border border-white/10 bg-[#20251c] p-5 sm:p-7">
            <div className="flex h-full flex-col justify-between rounded-[1.45rem] border border-white/10 bg-[linear-gradient(145deg,rgba(198,243,106,.12),transparent_48%),linear-gradient(25deg,#181b16,#292e24)] p-6 sm:p-8">
              <div className="flex items-start justify-between"><span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-white/60">{siteConfig.organization}</span><Sparkles className="size-5 text-[var(--accent)]" /></div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[.2em] text-[var(--accent)]">An open invitation</p>
                <p className="max-w-sm text-4xl font-medium leading-tight tracking-[-.045em] sm:text-5xl">{siteConfig.eventName}</p>
                <div className="my-7 h-px w-full bg-white/15" />
                <div className="flex items-center justify-between gap-3 text-xs text-white/55"><span>Make room for what&apos;s next</span><span className="font-mono">{siteConfig.mark} / 001</span></div>
              </div>
            </div>
            <div className="absolute -bottom-1 right-3 rounded-2xl border border-white/10 bg-[#151812] px-5 py-4 shadow-2xl sm:right-0 sm:translate-x-1/4"><p className="text-[10px] uppercase tracking-[.18em] text-white/45">Your next chapter</p><p className="mt-1 text-sm font-medium">Starts with showing up.</p></div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-12 lg:py-28">
          <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--accent)]">A little about us</p><h2 className="mt-5 max-w-md text-3xl font-medium leading-tight tracking-[-.04em] sm:text-5xl">A place to learn, make, and belong.</h2></div>
          <div className="max-w-2xl self-end"><p className="text-lg leading-8 text-white/65">{siteConfig.organization} brings people together around shared interests and new ideas. Whether you are here for one event or looking for a community, there is a place for you.</p><a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]" href="#experience">See what to expect <ArrowRight className="size-4" /></a></div>
        </div>
      </section>

      <section id="experience" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--accent)]">Why join us</p><h2 className="mt-4 text-3xl font-medium tracking-[-.04em] sm:text-5xl">Make the most of it.</h2></div><p className="max-w-sm text-sm leading-6 text-white/55">A thoughtful experience for newcomers and regulars alike.</p></div>
        <div className="grid gap-3 md:grid-cols-3">{siteConfig.highlights.map((item) => <article key={item.number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-7 transition hover:border-[var(--accent)]/40 sm:p-8"><span className="font-mono text-xs text-[var(--accent)]">{item.number}</span><h3 className="mt-10 text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{item.description}</p></article>)}</div>
      </section>

      <section id="register" className="relative z-10 border-y border-white/10 bg-[var(--accent)] text-[#171b11]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-16"><div><p className="text-xs font-bold uppercase tracking-[.2em] opacity-65">You are invited</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Find your people. Start here.</h2></div><a href="/register" className="inline-flex w-fit items-center rounded-full bg-[#171b11] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#303729]">Register for {siteConfig.eventName} <ArrowRight className="ml-2 size-4" /></a></div>
      </section>

      <section id="faq" className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:px-12 lg:py-28"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--accent)]">FAQ</p><h2 className="mt-4 text-3xl font-medium tracking-[-.04em] sm:text-5xl">Good questions.</h2><p className="mt-4 text-sm text-white/55">Still wondering about something? <a className="text-[var(--accent)] underline underline-offset-4" href={`mailto:${siteConfig.email}`}>Ask us</a>.</p></div><div className="divide-y divide-white/10">{siteConfig.faqs.map((item) => <details key={item.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium marker:hidden">{item.question}<span className="text-xl font-light text-[var(--accent)] transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-3 text-sm leading-6 text-white/55">{item.answer}</p></details>)}</div></section>

      <footer className="relative z-10 border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><span>© {new Date().getFullYear()} {siteConfig.organization}</span><span>Made for people who bring people together.</span><a className="transition hover:text-white" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div></footer>
    </main>
  );
}
