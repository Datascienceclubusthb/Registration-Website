'use client';
import Link from 'next/link';
import {useState} from 'react';
import {useRecruitment} from '@/hooks/use-recruitment';
import {recruitmentClosesAt, recruitmentDeadlineLabel} from '@/lib/recruitment';

export function CinematicHero() {
  const {closed, remaining} = useRecruitment();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <section className="cinematic-hero" id="hero" aria-labelledby="hero-title">
      <img
        className="cinematic-landscape"
        src="/dsc-landscape.webp"
        alt="A Minecraft-style riverside landscape with a club house, woodland and distant hills"
        width="2200"
        height="1300"
        fetchPriority="high"
      />
      <div className="cinematic-shade" aria-hidden="true" />
      <header className="cinematic-header">
        <Link className="cinematic-brand" href="/" aria-label="Data Science Club home">
          <img src="/dsc-logo.svg" alt="" width="44" height="44" />
          <span>
            Data Science Club<small>USTHB</small>
          </span>
        </Link>
        <button
          className="cinematic-menu"
          aria-expanded={menuOpen}
          aria-controls="cinematic-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Close' : 'Menu'} <span aria-hidden="true">{menuOpen ? '×' : '+'}</span>
        </button>
        <nav
          id="cinematic-navigation"
          className={`cinematic-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#worlds" onClick={() => setMenuOpen(false)}>
            The departments
          </a>
          <a href="#how-to-join" onClick={() => setMenuOpen(false)}>
            The experience
          </a>
          <Link
            href={closed ? '#recruitment-clock' : '/register'}
            onClick={() => setMenuOpen(false)}
          >
            {closed ? 'Recruitment closed' : 'Apply'} <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>
      <div className="cinematic-copy">
        <p className="cinematic-kicker">
          A NEW CHAPTER AT USTHB <span> / </span> 2026
        </p>
        <h1 id="hero-title">
          Good ideas.
          <br />
          Better together.
        </h1>
        <p className="cinematic-description">
          A place to learn, make things, and meet the people you’ll build them with. Welcome to the
          Data Science Club.
        </p>
        <div className="cinematic-actions">
          <Link href={closed ? '#recruitment-clock' : '/register'} className="editorial-button">
            {closed ? 'Applications closed' : 'Join the club'} <span aria-hidden="true">↗</span>
          </Link>
          <a href="#worlds">
            Take a look around <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className="cinematic-caption" aria-hidden="true">
        <span>
          THE WORLD IS BETTER
          <br />
          WHEN WE BUILD IT TOGETHER.
        </span>
        <i />
      </div>
      <div className="hero-timer" id="recruitment-clock">
        <div className="hero-timer-label">
          <span>
            {closed ? 'This recruitment round has ended.' : 'There’s still time to join us.'}
          </span>
          <time dateTime={recruitmentClosesAt}>{recruitmentDeadlineLabel}</time>
        </div>
        <div
          className="editorial-countdown"
          role="timer"
          aria-live="off"
          aria-label={`Time remaining until ${recruitmentDeadlineLabel}`}
        >
          {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
            <div key={unit}>
              <b>{remaining ? String(remaining[unit]).padStart(2, '0') : '—'}</b>
              <span>{unit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
