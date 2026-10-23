'use client';
import Link from 'next/link';
import {useState, type KeyboardEvent} from 'react';
import {departments} from '@/config/site';
import {CinematicHero} from '@/components/cinematic-hero';
import {VoxelIsland, WorldButton, WorldBrand, LocationPin} from '@/components/world-ui';
import {recruitmentDeadlineLabel} from '@/lib/recruitment';
const responsibilities = [
  [
    'Explore and explain datasets',
    'Experiment with machine learning',
    'Share findings with the community',
  ],
  [
    'Build applications and club tools',
    'Collaborate on code and reviews',
    'Turn ideas into useful software',
  ],
  ['Shape campaigns and stories', 'Create community content', 'Help people discover DSC'],
  [
    'Design identities and interfaces',
    'Create posters and multimedia',
    'Bring ideas to life visually',
  ],
  ['Welcome and support members', 'Listen to the community', 'Help teams work together'],
  ['Plan workshops and hackathons', 'Coordinate people and logistics', 'Make events run smoothly'],
  ['Connect with communities', 'Develop collaborations', 'Build relationships beyond campus'],
];
export default function Home() {
  const [selected, setSelected] = useState(0);
  const current = departments[selected];
  function navigate(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const keys: Record<string, number> = {
      ArrowRight: (i + 1) % 7,
      ArrowDown: (i + 1) % 7,
      ArrowLeft: (i + 6) % 7,
      ArrowUp: (i + 6) % 7,
      Home: 0,
      End: 6,
    };
    if (e.key in keys) {
      e.preventDefault();
      setSelected(keys[e.key]);
      document.getElementById(`department-${keys[e.key]}`)?.focus();
    }
  }
  return (
    <main className="datascience-world">
      <a className="skip-link" href="#club">
        Skip to content
      </a>
      <CinematicHero />
      <section id="club" className="world-about world-container">
        <div className="world-about-art">
          <VoxelIsland
            index={7}
            label="Students building a structure together on a floating island"
          />
          <span className="world-stamp">
            BUILT TOGETHER.
            <br />
            BUILT TO LAST.
          </span>
        </div>
        <div>
          <p className="world-kicker">02 / THE COMMUNITY</p>
          <h2>
            DIFFERENT SKILLS.
            <br />
            <em>ONE WORLD.</em>
          </h2>
          <p className="world-lead">Great things are built together.</p>
          <p>
            Data Science Club is a university community at USTHB, dedicated to technology,
            innovation, collaboration and learning. Bring your curiosity. There’s room for what
            makes you, you.
          </p>
          <ul className="world-values">
            <li>
              <span>01</span>Learn from each other. Grow your technical and people skills.
            </li>
            <li>
              <span>02</span>Build real projects through workshops, hackathons and shared ideas.
            </li>
            <li>
              <span>03</span>Meet people, discover opportunities, and help everyone feel welcome.
            </li>
          </ul>
        </div>
      </section>
      <section id="worlds" className="world-departments">
        <div className="world-container">
          <div className="world-section-heading">
            <div>
              <p className="world-kicker">03 / EXPLORE THE WORLD</p>
              <h2>
                CHOOSE YOUR <em>PATH.</em>
              </h2>
            </div>
            <p>
              Every player has their strengths.
              <br />
              Find where yours belong.
            </p>
          </div>
          <div className="world-selector" role="tablist" aria-label="Departments">
            {departments.map((d, i) => (
              <button
                role="tab"
                key={d.id}
                id={`department-${i}`}
                aria-selected={i === selected}
                aria-controls="department-detail"
                tabIndex={i === selected ? 0 : -1}
                onKeyDown={(e) => navigate(e, i)}
                onClick={() => setSelected(i)}
              >
                <span>0{i + 1}</span>
                {d.name}
              </button>
            ))}
          </div>
          <div
            className="world-department-detail"
            id="department-detail"
            role="tabpanel"
            aria-labelledby={`department-${selected}`}
            tabIndex={0}
          >
            <div className="department-island">
              <VoxelIsland
                index={selected}
                label={`${current.name}: ${current.landmark} on a Minecraft floating island`}
              />
              <LocationPin number={`0${selected + 1}`} />
              <span className="island-coordinate">
                STATION 0{selected + 1} / {current.landmark.toUpperCase()}
              </span>
            </div>
            <div className="department-description">
              <p className="world-kicker">YOUR NEXT DISCOVERY / 0{selected + 1}</p>
              <h3>{current.name}</h3>
              <p>{current.description}</p>
              <ul>
                {responsibilities[selected].map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="world-skills">{current.skills.join(' / ')}</p>
              <WorldButton href="/register">EXPLORE YOUR FIT</WorldButton>
              <p className="world-note">
                Your preferences help us get to know you. They don’t determine your final
                department.
              </p>
            </div>
          </div>
          <div className="world-island-route" aria-label="Explore another department">
            {departments.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setSelected(i)}
                aria-pressed={i === selected}
                aria-label={`Explore ${d.name}`}
              >
                <VoxelIsland index={i} label="" />
                <span>0{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section id="activities" className="world-activities world-container">
        <div className="world-section-heading">
          <div>
            <p className="world-kicker">04 / MORE THAN MEETINGS</p>
            <h2>
              LEARN. BUILD.
              <br />
              <em>DO IT TOGETHER.</em>
            </h2>
          </div>
          <p>
            A challenge. A new skill. A first project.
            <br />
            Find your reason to join.
          </p>
        </div>
        <div className="world-activity-list">
          {[
            [
              'Data Fest',
              'THE HACKATHON',
              'Turn a challenge into your team’s next idea. Explore data, experiment together, and build a solution you can share.',
              5,
              'Explore the challenge / Build as a team / Present your solution',
            ],
            [
              'Data Camp',
              'THE BOOTCAMP',
              'Learn by doing. Explore data science step by step, ask questions, and build confidence through hands-on practice.',
              0,
              'Learn the concepts / Put them into practice / Keep progressing',
            ],
            [
              'Projects',
              'THE PROJECT SERIES',
              'Keep the momentum going with a series of collaborative projects. Start with a question and turn what you learn into something real.',
              1,
              'Choose an idea / Build and iterate / Share what you made',
            ],
          ].map(([name, type, description, index, detail], i) => (
            <article key={name} className="world-activity">
              <div className="activity-heading">
                <span className="world-kicker">
                  0{i + 1} / {type}
                </span>
                <h3>{name}</h3>
              </div>
              <VoxelIsland index={Number(index)} label={`${name} Minecraft location`} />
              <div>
                <p>{description}</p>
                <details>
                  <summary>
                    Explore {name}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{detail}</p>
                </details>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="how-to-join" className="world-join">
        <div className="world-container world-join-inner">
          <div>
            <p className="world-kicker">05 / YOUR FIRST QUEST</p>
            <h2>
              SMALL STEP.
              <br />
              NEW <em>ADVENTURE.</em>
            </h2>
            <p>
              No account. No perfect CV. Just you, your interests,
              <br />
              and what you’d like to build next.
            </p>
            <WorldButton href="/register">CREATE YOUR PLAYER PROFILE</WorldButton>
          </div>
          <ol>
            {[
              ['Introduce yourself', 'A few details, your interests and your skills.'],
              ['Tell your story', 'What brings you here, and what would you like to learn?'],
              ['Send your application', 'Review your answers. Our team will take it from there.'],
            ].map(([title, copy], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="world-faq world-container" id="faq">
        <div>
          <p className="world-kicker">BEFORE YOU STEP INSIDE</p>
          <h2>
            A FEW <em>ANSWERS.</em>
          </h2>
        </div>
        <div>
          {[
            [
              'Do I need to know how to code?',
              'No. Design, communication, organisation, partnerships, software and data all have a place at DSC. Curiosity and a willingness to learn matter.',
            ],
            [
              'Are my department preferences final?',
              'No. You can rank up to three interests, without duplicates. These are preferences, not a confirmed placement. The team will discuss the right fit with you.',
            ],
            [
              'Can I finish my application later?',
              'Yes. Your draft stays in this browser on this device. Avoid shared devices for personal information, and submit before recruitment closes.',
            ],
            ['When do applications close?', `This round closes on ${recruitmentDeadlineLabel}.`],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <footer className="world-footer">
        <div className="world-container">
          <div className="footer-title">
            <h2>
              YOUR WORLD.
              <br />
              <em>OUR NEXT CHAPTER.</em>
            </h2>
            <WorldButton href="/register">JOIN THE WORLD</WorldButton>
          </div>
          <div className="world-footer-bottom">
            <WorldBrand />
            <span>© 2026 Data Science Club · USTHB</span>
            <Link href="/privacy">Application privacy</Link>
            <Link href="/admin">Admin access ↗</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
