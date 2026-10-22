'use client';

import Link from 'next/link';
import { useState } from 'react';
import { departments } from '@/config/site';

export default function Home() {
  const [selected, setSelected] = useState(0);
  const current = departments[selected];

  return (
    <main className="game-home">
      <section className="title-world" id="top" aria-label="Data Science Club world">
        <div className="world-picture" />
        <div className="world-shade" />
        <div className="title-hud"><span>DSC REALM • SEED 001</span><span>USTHB / OVERWORLD</span></div>
        <div className="menu-stack">
          <div className="club-crest"><img src="/dsc-logo.svg" alt="Data Science Club official logo" /><span>USTHB • CLUB REALM</span></div>
          <div className="game-title"><span>DATA SCIENCE</span><strong>CLUB</strong><i>RECRUITMENT • USTHB</i></div>
          <nav className="main-menu" aria-label="Main menu">
            <a className="game-button primary" href="#worlds">PLAY</a>
            <a className="game-button" href="#how-to-join">HOW TO JOIN</a>
            <a className="game-button" href="#about">ABOUT THE CLUB</a>
          </nav>
          <p className="menu-caption">Recruitment open · All skill levels welcome</p>
        </div>
        <div className="pixel-player" aria-hidden="true"><span className="head"/><span className="body"/><span className="arm"/><span className="legs"/></div>
        <div className="game-version">JAVA EDITION • DSC 1.0</div>
        <a className="admin-door" href="/admin">ADMIN</a>
      </section>

      <section className="world-select" id="worlds">
        <div className="section-heading"><div><span className="eyebrow">SELECT YOUR DESTINATION</span><h1>EXPLORE THE REALM</h1></div><p>Seven places to build, learn, and find your people.<br/>Choose a location to inspect the work inside.</p></div>
        <div className="world-frame">
          <div className="realm-map" role="tablist" aria-label="Club departments">
            {departments.map((department, index) => <button key={department.id} role="tab" aria-selected={selected === index} className={`map-location location-${index + 1}${selected === index ? ' active' : ''}`} onClick={() => setSelected(index)}><span className="location-icon">{department.icon}</span><span className="location-name">{department.landmark}</span><span className="location-number">{String(index + 1).padStart(2, '0')}</span></button>)}
            <span className="map-path path-a"/><span className="map-path path-b"/><span className="map-path path-c"/><span className="map-coordinate">X: 218 / Z: 64</span>
          </div>
          <article className="world-inspector" role="tabpanel">
            <div className="inspector-top"><span>LOCATION DISCOVERED</span><span>{String(selected + 1).padStart(2, '0')} / 07</span></div>
            <div className={`landmark-art art-${selected + 1}`} aria-hidden="true"><span className="landmark-sun"/><span className="landmark-building"/><span className="landmark-door"/><span className="landmark-window one"/><span className="landmark-window two"/><span className="landmark-tree"/></div>
            <p className="biome-label">{current.biome.toUpperCase()}</p><h2>{current.name}</h2><p className="location-description">{current.description}</p>
            <p className="loot-label">COMMONLY FOUND SKILLS</p><div className="loot-row">{current.skills.map((skill) => <span className="loot-slot" key={skill}><b className="ore">✦</b>{skill}</span>)}</div>
            <Link className="game-button join-button" href={`/register?department=${current.id}`}>CHOOSE THIS PATH <span>▶</span></Link>
          </article>
        </div>
        <div className="world-footer"><span>WORLD TYPE: COMMUNITY</span><span>7 LOCATIONS · 1 SHARED WORLD</span><span>MODE: LEARN & BUILD</span></div>
      </section>

      <section className="join-guide" id="how-to-join"><div className="guide-title"><span className="eyebrow">YOUR QUEST LOG</span><h2>HOW TO JOIN THE CLUB</h2><p>Every player starts somewhere. No prior experience required.</p></div><div className="quest-steps"><div className="quest-step"><span className="step-icon">01</span><div><b>CHOOSE A PATH</b><p>Explore departments and rank up to three choices.</p></div></div><div className="quest-step"><span className="step-icon">02</span><div><b>PACK YOUR INVENTORY</b><p>Tell us what you enjoy, know, and want to learn.</p></div></div><div className="quest-step"><span className="step-icon">03</span><div><b>SUBMIT YOUR QUEST</b><p>Complete your player profile. We’ll be in touch.</p></div></div></div><Link className="game-button guide-button" href="/register">START APPLICATION <span>▶</span></Link></section>

      <footer className="game-footer" id="about"><div className="footer-logo"><img src="/dsc-logo.svg" alt=""/><span>DATA SCIENCE CLUB<br/>UNIVERSITY OF SCIENCE AND TECHNOLOGY HOUARI BOUMEDIENE</span></div><p>One community. Different talents. Infinite possibilities.</p><Link href="/register">APPLY TO JOIN ↗</Link><span className="copyright">© {new Date().getFullYear()} DSC • USTHB, ALGERIA</span></footer>
    </main>
  );
}
