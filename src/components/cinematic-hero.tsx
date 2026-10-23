'use client';
import {useState} from 'react';
import {useRecruitment} from '@/hooks/use-recruitment';
import {recruitmentClosesAt, recruitmentDeadlineLabel} from '@/lib/recruitment';
import {WorldBrand, WorldButton, LocationPin} from './world-ui';
export function CinematicHero() {
  const [open, setOpen] = useState(false);
  const {closed, remaining, checking, unavailable} = useRecruitment();
  return (
    <>
      <header className="world-header world-container">
        <WorldBrand />
        <button
          className="world-menu"
          aria-controls="world-nav"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '+'}</span>
        </button>
        <nav id="world-nav" className={open ? 'open' : ''} aria-label="Main navigation">
          {[
            ['The club', '#club'],
            ['Departments', '#worlds'],
            ['Activities', '#activities'],
          ].map(([title, url]) => (
            <a key={url} href={url} onClick={() => setOpen(false)}>
              {title}
            </a>
          ))}
          <a href="/register" className="nav-apply">
            {closed ? 'Recruitment status' : 'Apply now'} ↗
          </a>
        </nav>
      </header>
      <section className="world-hero world-container" aria-labelledby="hero-title">
        <div className="world-hero-copy">
          <p className="world-kicker">
            <span /> USTHB RECRUITMENT / 2026
          </p>
          <h1 id="hero-title">
            YOUR NEXT
            <br />
            ADVENTURE
            <br />
            STARTS <em>HERE.</em>
          </h1>
          <p className="world-intro">
            Welcome to DataScience World. A community where students explore technology, build real
            projects, share knowledge and grow together.
          </p>
          <div className="world-actions">
            <WorldButton href="/register">
              {closed ? 'RECRUITMENT STATUS' : 'JOIN THE WORLD'}
            </WorldButton>
            <a href="#club" className="world-text-link">
              EXPLORE THE CLUB <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-coordinate">
            <span>01 — THE ENTRANCE</span>
            <span>YOUR STORY STARTS HERE</span>
          </div>
        </div>
        <div className="world-hero-art">
          <div className="world-art-label">
            <span>DSC</span> WORLD / 01
          </div>
          <img
            src="/world/portal.webp"
            alt="A blocky student approaches an orange portal on a floating Minecraft grass and stone island"
            width="1100"
            height="1100"
            fetchPriority="high"
          />
          <LocationPin />
          <div className="portal-tag">
            NEW WORLD DISCOVERED <span>↗</span>
          </div>
          <span className="pixel-corner" aria-hidden="true" />
        </div>
      </section>
      <div className="world-deadline world-container" id="recruitment-clock">
        <div>
          <span className="world-kicker">
            {closed
              ? 'THIS CHAPTER IS CLOSED'
              : checking || unavailable
                ? 'YOUR NEXT CHAPTER'
                : 'YOUR NEXT CHAPTER IS CALLING'}
          </span>
          <p>
            {closed
              ? 'Applications are closed.'
              : checking || unavailable
                ? 'Check recruitment status before submitting.'
                : 'Submit your application before the portal closes.'}
          </p>
          <time dateTime={recruitmentClosesAt}>{recruitmentDeadlineLabel}</time>
        </div>
        <div
          className="editorial-countdown"
          role="timer"
          aria-label="Time until recruitment closes"
        >
          {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
            <div key={unit}>
              <b>{remaining ? String(remaining[unit]).padStart(2, '0') : '—'}</b>
              <span>{unit}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
