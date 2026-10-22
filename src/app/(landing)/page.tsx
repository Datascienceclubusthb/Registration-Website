'use client';

import Link from 'next/link';
import {useState, type KeyboardEvent} from 'react';
import {departments} from '@/config/site';
import {CinematicHero} from '@/components/cinematic-hero';
import {useRecruitment} from '@/hooks/use-recruitment';
import {recruitmentDeadlineLabel} from '@/lib/recruitment';

const projects = [
  ['Explore real datasets', 'Experiment with machine learning', 'Make data easier to understand'],
  ['Build useful web applications', 'Collaborate on club tools', 'Learn through shared projects'],
  [
    'Tell the stories behind our projects',
    'Create content for the community',
    'Help people discover our events',
  ],
  ['Create visual identities', 'Design posters and interfaces', 'Explore photography and motion'],
  [
    'Welcome and support members',
    'Listen to the needs of the community',
    'Help people find their place',
  ],
  [
    'Shape workshops and meetups',
    'Coordinate teams and logistics',
    'Bring shared ideas into a room',
  ],
  [
    'Connect with other communities',
    'Develop meaningful collaborations',
    'Build relationships beyond campus',
  ],
];

export default function Home() {
  const [selected, setSelected] = useState(0);
  const {closed} = useRecruitment();
  const current = departments[selected];
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowDown: (index + 1) % departments.length,
      ArrowRight: (index + 1) % departments.length,
      ArrowUp: (index + departments.length - 1) % departments.length,
      ArrowLeft: (index + departments.length - 1) % departments.length,
      Home: 0,
      End: departments.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    setSelected(keys[event.key]);
    document.getElementById(`department-${keys[event.key]}`)?.focus();
  }
  return (
    <main className="refined-home">
      <a className="skip-link" href="#club">
        Skip to content
      </a>
      <CinematicHero />
      <section className="club-story" id="club">
        <div className="editorial-container story-layout">
          <div>
            <p className="section-label">THE CLUB</p>
            <h2>
              A shared curiosity.
              <br />
              Room to grow.
            </h2>
          </div>
          <div>
            <p className="story-lead">You don’t need to have it all figured out.</p>
            <p>
              At the Data Science Club, people with different interests come together to learn and
              make things. Some write code. Others design, organise, communicate, or connect people.
            </p>
            <p>Bring what you know. Discover what you don’t. There’s a place to start.</p>
            <div className="story-facts">
              <span>USTHB, Algiers</span>
              <span>Seven departments</span>
              <span>All skill levels</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="department-section editorial-container"
        id="worlds"
        aria-labelledby="departments-title"
      >
        <div className="editorial-section-head">
          <div>
            <p className="section-label">THE PEOPLE BEHIND THE CLUB</p>
            <h2 id="departments-title">
              Different interests.
              <br />A shared direction.
            </h2>
          </div>
          <p>
            Meet the departments that make DSC.
            <br />
            Explore what feels familiar — or try something new.
          </p>
        </div>
        <div className="department-browser">
          <div
            className="department-index"
            role="tablist"
            aria-label="Departments"
            aria-orientation="vertical"
          >
            {departments.map((department, index) => (
              <button
                id={`department-${index}`}
                key={department.id}
                role="tab"
                aria-selected={index === selected}
                aria-controls="department-detail"
                tabIndex={selected === index ? 0 : -1}
                onKeyDown={(event) => navigate(event, index)}
                onClick={() => setSelected(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <b>{department.name}</b>
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>
          <article
            className="department-detail"
            id="department-detail"
            role="tabpanel"
            aria-labelledby={`department-${selected}`}
            tabIndex={0}
          >
            <p className="detail-number">{String(selected + 1).padStart(2, '0')} / 07</p>
            <h3>{current.name}</h3>
            <p>{current.description}</p>
            <h4>What you could explore</h4>
            <ul>
              {projects[selected].map((project) => (
                <li key={project}>{project}</li>
              ))}
            </ul>
            <p className="department-skills">{current.skills.join(' · ')}</p>
            <Link href="/register" className="department-apply">
              {closed ? 'View recruitment status' : 'Apply to the club'}{' '}
              <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>
        <p className="department-footnote">
          You’re applying to the club. You can mention one department that interests you, but it’s
          optional and doesn’t determine your placement.
        </p>
      </section>

      <section className="joining-section" id="how-to-join">
        <div className="editorial-container joining-layout">
          <div>
            <p className="section-label">GETTING STARTED</p>
            <h2>
              Come as you are.
              <br />
              Let’s see what’s next.
            </h2>
            <p>
              A short application. A bit about you.
              <br />
              No account to create, no perfect CV expected.
            </p>
            <Link href="/register" className="editorial-button dark">
              {closed ? 'Recruitment status' : 'Start your application'}{' '}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ol className="joining-steps">
            {[
              [
                'Introduce yourself',
                'Tell us who you are, what interests you, and what you’d like to learn or contribute.',
              ],
              [
                'Take your time',
                'Your draft stays in this browser. You can come back to finish it before the closing date.',
              ],
              [
                'We’ll be in touch',
                'The recruitment team will review your application and contact you about the next steps.',
              ],
            ].map(([title, description], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="questions-section editorial-container" id="faq">
        <div>
          <p className="section-label">BEFORE YOU APPLY</p>
          <h2>
            A few things
            <br />
            worth knowing.
          </h2>
        </div>
        <div className="questions-list">
          {[
            [
              'Do I need to know how to code?',
              'No. There are many ways to contribute: design, communication, organisation, partnerships, software, and data. A willingness to learn matters more than a specific starting point.',
            ],
            [
              'Do I need to choose a department?',
              'No. If a department interests you, you can mention it in the form. That preference is optional and not a final placement. The club team will discuss the right fit with you.',
            ],
            [
              'Can I finish my application later?',
              'Yes. Your draft is saved in this browser on this device. Return here to finish it before the deadline.',
            ],
            [
              'When do applications close?',
              `This round closes on ${recruitmentDeadlineLabel}. Your application must be submitted before that time.`,
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
      <footer className="editorial-footer">
        <div className="editorial-container">
          <div className="footer-invitation">
            <h2>{closed ? 'Until the next chapter.' : 'See you on the other side.'}</h2>
            <Link href="/register" className="editorial-button">
              {closed ? 'Recruitment status' : 'Join Data Science Club'}{' '}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="editorial-footer-bottom">
            <Link href="/" className="cinematic-brand">
              <img
                src="/dsc-logo.svg"
                width="36"
                height="36"
                alt="Data Science Club official logo"
              />
              <span>
                Data Science Club<small>USTHB · ALGIERS</small>
              </span>
            </Link>
            <span>© {new Date().getFullYear()} Data Science Club</span>
            <Link href="/admin">Admin access ↗</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
