'use client';

import Link from 'next/link';
import {useState, type KeyboardEvent} from 'react';
import {departments} from '@/config/site';
import {CinematicHero} from '@/components/cinematic-hero';
import {PixelIcon} from '@/components/pixel-icon';
import {useRecruitment} from '@/hooks/use-recruitment';
import {recruitmentClosesAt, recruitmentDeadlineLabel} from '@/lib/recruitment';

const icons = ['redstone', 'pickaxe', 'torch', 'diamond', 'book', 'flag', 'portal'];
const coordinates = [
  '142, 64, 218',
  '86, 72, 144',
  '218, 96, 108',
  '190, 64, 264',
  '64, 64, 196',
  '238, 64, 282',
  '48, 80, 72',
];
const quests = [
  {
    name: 'Find your people',
    text: 'Explore seven departments. See what interests you. There is no department assignment at this stage.',
    icon: 'portal',
    item: '01 / EXPLORATION',
  },
  {
    name: 'Pack your inventory',
    text: 'Tell us about yourself, your interests, and what you would love to learn or build.',
    icon: 'book',
    item: '02 / PREPARATION',
  },
  {
    name: 'Begin your adventure',
    text: 'Send your application. Our team will review it and get in touch with the next steps.',
    icon: 'pickaxe',
    item: '03 / APPLICATION',
  },
];

export default function Home() {
  const [selected, setSelected] = useState(0);
  const {closed} = useRecruitment();
  const current = departments[selected];
  const applyHref = closed ? '#recruitment-clock' : '/register';
  function navigateDepartments(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
      next = (index + 1) % departments.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
      next = (index - 1 + departments.length) % departments.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = departments.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    document.getElementById(`department-tab-${next}`)?.focus();
  }
  return (
    <main className="game-home">
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      <CinematicHero />

      <section className="realm-intro site-container" id="about">
        <div className="intro-mark">
          <PixelIcon name="diamond" />
        </div>
        <p>
          Different skills. <span>One shared world.</span>
          <small>
            We’re a community of curious minds at USTHB. From data and code to design and events,
            there’s more than one way to make your mark.
          </small>
        </p>
        <div className="realm-facts">
          <div>
            <b>07</b>
            <span>departments</span>
          </div>
          <div>
            <b>01</b>
            <span>community</span>
          </div>
          <div>
            <b>∞</b>
            <span>possibilities</span>
          </div>
        </div>
      </section>

      <section className="world-select site-container" id="worlds" aria-labelledby="worlds-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / WORLD SELECT</span>
            <h2 id="worlds-title">Find your biome.</h2>
          </div>
          <p>
            Not everyone has to be a coder.
            <br />
            Explore the places where your curiosity can take you.
          </p>
        </div>
        <div className="world-window">
          <div className="window-bar">
            <span>
              <i /> DataScience World / Select a destination
            </span>
            <span className="hidden sm:inline">7 LOCATIONS DISCOVERED</span>
          </div>
          <div className="world-layout">
            <div
              className="department-list"
              role="tablist"
              aria-label="Club departments"
              aria-orientation="vertical"
            >
              {departments.map((department, index) => (
                <button
                  key={department.id}
                  id={`department-tab-${index}`}
                  role="tab"
                  aria-selected={selected === index}
                  aria-controls="department-panel"
                  tabIndex={selected === index ? 0 : -1}
                  onKeyDown={(e) => navigateDepartments(e, index)}
                  className={`department-tab ${selected === index ? 'active' : ''}`}
                  onClick={() => setSelected(index)}
                >
                  <span className="inventory-icon">
                    <PixelIcon name={icons[index]} />
                  </span>
                  <span>
                    <b>{department.landmark}</b>
                    <small>{department.name}</small>
                  </span>
                  <span className="tab-arrow" aria-hidden="true">
                    {selected === index ? '▶' : String(index + 1).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
            <div
              className="destination"
              id="department-panel"
              role="tabpanel"
              aria-labelledby={`department-tab-${selected}`}
              tabIndex={0}
            >
              <div className={`destination-map biome-${selected}`}>
                <span className="map-coordinate">XYZ: {coordinates[selected]}</span>
                <img src="/dsc-realm.svg" alt="" loading="lazy" width="1300" height="850" />
                {departments.map((dept, index) => (
                  <button
                    key={dept.id}
                    aria-label={`Explore ${dept.landmark}`}
                    aria-pressed={index === selected}
                    onClick={() => setSelected(index)}
                    className={`map-pin pin-${index} ${selected === index ? 'active' : ''}`}
                  >
                    <PixelIcon name={icons[index]} />
                    <span>{dept.landmark}</span>
                  </button>
                ))}
                <span className="map-hint">SELECT A MARKER TO EXPLORE</span>
              </div>
              <div className="destination-info">
                <div className="flex items-center gap-2">
                  <span className="eyebrow">
                    LOCATION {String(selected + 1).padStart(2, '0')} / 07
                  </span>
                  <span className="biome-badge">{current.biome}</span>
                </div>
                <h3>{current.name}</h3>
                <p>{current.description}</p>
                <div className="destination-bottom">
                  <div className="skill-chips">
                    {current.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                  <Link
                    className="game-button primary small"
                    href={closed ? '#recruitment-clock' : `/register?department=${current.id}`}
                  >
                    {closed ? 'Recruitment closed' : 'Apply to the club'}{' '}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="world-note">
          <PixelIcon name="book" /> Your application is to the club. Any department preference is
          optional and non-binding.
        </p>
      </section>

      <section className="quest-section" id="how-to-join">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / QUEST LOG</span>
              <h2>Your first quest starts here.</h2>
            </div>
            <span className="quest-reward">
              <PixelIcon name="diamond" /> REWARD: A COMMUNITY TO GROW WITH
            </span>
          </div>
          <div className="quest-grid">
            {quests.map((quest) => (
              <article key={quest.name} className="quest-item">
                <div className="quest-top">
                  <span className="inventory-icon">
                    <PixelIcon name={quest.icon} />
                  </span>
                  <span>{quest.item}</span>
                </div>
                <h3>{quest.name}</h3>
                <p>{quest.text}</p>
                <div className="quest-check">
                  <span aria-hidden="true">□</span> Your adventure, your pace.
                </div>
              </article>
            ))}
          </div>
          <div className="quest-cta">
            <p>
              No experience requirement.
              <br />
              <strong>Just bring your curiosity.</strong>
            </p>
            <Link className="game-button primary" href={applyHref}>
              {closed ? 'Applications closed' : 'Let’s build something together'}{' '}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="faq-section site-container" id="faq">
        <div>
          <span className="eyebrow">03 / PLAYER GUIDE</span>
          <h2>
            A little help
            <br />
            before you spawn.
          </h2>
          <p>New world. Familiar questions.</p>
          <div className="guide-book" aria-hidden="true">
            <PixelIcon name="book" />
          </div>
        </div>
        <div className="faq-list">
          {[
            [
              'Do I need to know how to code?',
              'No. Our seven departments welcome different interests: data, software, design, communication, people, events, and partnerships. Curiosity and willingness to learn matter.',
            ],
            [
              'Do I have to choose a department?',
              'No. You may mention one department that interests you, or leave it blank. This is only an expression of interest, not a confirmed placement. The club team will discuss the right fit with you.',
            ],
            [
              'Can I finish my application later?',
              'Yes. Your progress is saved in this browser on this device. Come back before the deadline to review and submit it.',
            ],
            [
              'What happens after I apply?',
              'The club team reviews your application and contacts you using the details you provide. Submitting an application is the first step, not a confirmation of membership.',
            ],
            [
              'When do registrations close?',
              `This round closes on ${recruitmentDeadlineLabel}. The countdown above shows the remaining time. Submit your application before it reaches zero.`,
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <footer className="game-footer">
        <div className="site-container">
          <div className="footer-main">
            <Link href="/" className="brand-lockup">
              <img
                src="/dsc-logo.svg"
                alt="Data Science Club official logo"
                width="48"
                height="48"
              />
              <span>
                DATA SCIENCE CLUB<small>Build. Learn. Belong.</small>
              </span>
            </Link>
            <p>
              A shared world for curious minds.
              <br />
              USTHB · Bab Ezzouar, Algeria
            </p>
            <a href="#hero" className="world-link">
              Back to spawn ↑
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Data Science Club · USTHB</span>
            <span>CRAFTED FOR THE NEXT GENERATION OF BUILDERS</span>
            <Link href="/admin">Admin access ↗</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
