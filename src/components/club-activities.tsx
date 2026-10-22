import Link from 'next/link';

type Scene = 'fest' | 'camp' | 'projects';

// Small original block-built dioramas, rendered as SVG rather than a WebGL runtime.
function ActivityWorld({scene}: {scene: Scene}) {
  const palette =
    scene === 'fest'
      ? ['#9f94ce', '#655a91', '#44395f']
      : scene === 'camp'
        ? ['#b2bb78', '#6c8055', '#485b41']
        : ['#9acbc0', '#527f77', '#375c58'];
  function block(x: number, y: number, z: number, height = 1, colors = palette) {
    const px = 220 + (x - y) * 23;
    const py = 175 + (x + y) * 12 - z * 24;
    return (
      <g key={`${x}-${y}-${z}`}>
        <path d={`M${px},${py} l23,12 -23,12 -23,-12Z`} fill={colors[0]} />
        <path d={`M${px - 23},${py + 12} l23,12 v${height * 24} l-23,-12Z`} fill={colors[1]} />
        <path d={`M${px},${py + 24} l23,-12 v${height * 24} l-23,12Z`} fill={colors[2]} />
      </g>
    );
  }
  const ground = [];
  for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) ground.push(block(x, y, 0, 1.2));
  return (
    <svg className="activity-world" viewBox="0 0 440 345" fill="none" aria-hidden="true">
      <path d="M40 270L220 175L400 270L220 365Z" fill="#000" opacity=".12" />
      {ground}
      {scene === 'fest' && (
        <>
          {[-2, 2].map((x) =>
            [-2, 2].map((y) => block(x, y, 2, 2, ['#51496c', '#342e48', '#272338']))
          )}
          {block(0, 0, 1, 1, ['#e2d9ff', '#a798ce', '#746397'])}
          {block(0, 0, 2, 1, ['#edfaff', '#a4e8e3', '#64aaa8'])}
          <path
            className="beacon-light"
            d="M197 151V10H243V151L220 163Z"
            fill="#d5ffef"
            opacity=".22"
          />
          <path d="M214 154V10H226V154L220 158Z" fill="#e9fff6" opacity=".6" />
          {[
            [-2, -2],
            [2, -2],
            [-2, 2],
            [2, 2],
          ].map(([x, y]) => block(x, y, 2.2, 0.2, ['#e2c4ff', '#9e7bc5', '#705095']))}
          <path d="M69 93h7v7h-7zM337 127h5v5h-5zM286 48h6v6h-6zM151 49h4v4h-4z" fill="#d7c2f2" />
        </>
      )}
      {scene === 'camp' && (
        <>
          {block(-2, -1, 1, 1, ['#8e724f', '#624c36', '#473a2b'])}
          {block(-2, -1, 2.2, 1.2, ['#708d56', '#48663d', '#344e30'])}
          {block(-2, -1, 3.2, 1, ['#879e61', '#587945', '#3a5b35'])}
          <path d="M221 133L292 170L292 240L221 203L151 240L151 170Z" fill="#d8ab65" />
          <path d="M221 133V203L151 240L151 170Z" fill="#f0cf8c" />
          <path d="M221 166V203L177 226Z" fill="#4e5037" />
          {block(1, 2, 0.25, 0.25, ['#b18c60', '#775435', '#573c28'])}
          <path d="M185 231h17v-16h11v-21h9v16h11v31h-16v10h-21v-8h-11Z" fill="#f0a24b" />
          <path d="M200 236h9v-17h8v25h-17Z" fill="#ffe0a1" />
          <path d="M208 184h6v6h-6zM224 168h4v4h-4z" fill="#edce91" />
        </>
      )}
      {scene === 'projects' && (
        <>
          {block(-2, -1, 1, 1, ['#d3bd88', '#978055', '#675937'])}
          {block(-1, -1, 1, 1, ['#d3bd88', '#978055', '#675937'])}
          {block(-2, -1, 2, 1, ['#bedcd1', '#6e9e92', '#456e65'])}
          {block(1, -1, 2, 2, ['#87b7a5', '#508776', '#365f54'])}
          {block(2, -1, 3, 3, ['#bedcb4', '#7ea375', '#56774d'])}
          {block(2, 1, 1, 1, ['#dbcc9b', '#a08b60', '#756442'])}
          <path d="M176 159l22 11v20l-22-11Z" fill="#243f3e" />
          <path d="M181 167l5 3v3l-5-3zm8 5l5 3v3l-5-3z" fill="#a8e3ce" />
          <path d="M220 66h7v7h-7zM317 120h5v5h-5zM116 129h5v5h-5z" fill="#a7d7c6" />
        </>
      )}
    </svg>
  );
}

const activities = [
  {
    id: 'fest' as const,
    name: 'Data Fest',
    format: 'THE HACKATHON',
    headline: 'One challenge. Your team’s answer.',
    description:
      'Bring your ideas to the table. Data Fest is our hackathon: a space to tackle a data challenge together, experiment, and turn a first idea into something you can present.',
    steps: ['Explore the challenge', 'Build as a team', 'Share your solution'],
    detail:
      'Work through a problem with other curious minds. From understanding the data to explaining your approach, every part of the process is an opportunity to contribute.',
    action: 'Inside the hackathon',
  },
  {
    id: 'camp' as const,
    name: 'Data Camp',
    format: 'THE BOOTCAMP',
    headline: 'Start curious. Leave with practice.',
    description:
      'Our bootcamp puts learning into action. Explore data science step by step, try things for yourself, and build confidence through hands-on practice.',
    steps: ['Learn the concepts', 'Try them out', 'Keep progressing'],
    detail:
      'Make room for questions, exercises, and experimentation. Data Camp is about connecting what you learn with what you can actually do with it.',
    action: 'Inside the bootcamp',
  },
  {
    id: 'projects' as const,
    name: 'Projects',
    format: 'THE PROJECT SERIES',
    headline: 'Less “what if”. More “we built this”.',
    description:
      'A series of projects to keep the momentum going. Explore an idea, build with other members, and turn what you’re learning into work you can share.',
    steps: ['Pick an idea', 'Build and iterate', 'Show what you made'],
    detail:
      'Move from a question to a working result, one project at a time. Explore data, experiment with tools, and learn from the decisions you make along the way.',
    action: 'Inside the project series',
  },
];

export function ClubActivities() {
  return (
    <section className="activities-section" id="activities" aria-labelledby="activities-title">
      <div className="editorial-container">
        <div className="activities-heading">
          <div>
            <p className="section-label">LIFE AT DSC / BEYOND THE CLASSROOM</p>
            <h2 id="activities-title">
              Don’t just learn it.
              <br />
              <span>Make something happen.</span>
            </h2>
          </div>
          <p>
            Challenges to take on.
            <br />
            Things to figure out.
            <br />
            People to build with.
          </p>
        </div>
        <div className="activities-grid">
          {activities.map((activity, index) => (
            <article className={`activity-poster activity-${activity.id}`} key={activity.id}>
              <div className="activity-poster-top">
                <span>{activity.format}</span>
                <span>0{index + 1} / DSC</span>
              </div>
              <h3>{activity.name}</h3>
              <div className="activity-art">
                <ActivityWorld scene={activity.id} />
                <span className="activity-art-caption">
                  {activity.id === 'fest'
                    ? 'MEET AT THE BEACON'
                    : activity.id === 'camp'
                      ? 'SET UP. LEVEL UP.'
                      : 'ONE BLOCK AT A TIME.'}
                </span>
              </div>
              <div className="activity-copy">
                <h4>{activity.headline}</h4>
                <p>{activity.description}</p>
                <details>
                  <summary>
                    {activity.action}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div className="activity-expanded">
                    <p>{activity.detail}</p>
                    <ol>
                      {activity.steps.map((step, i) => (
                        <li key={step}>
                          <span>0{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              </div>
            </article>
          ))}
        </div>
        <div className="activities-outro">
          <p>
            A challenge, a new skill, a first project.
            <br />
            <strong>Find your reason to join.</strong>
          </p>
          <Link href="/register">
            Explore club recruitment <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
