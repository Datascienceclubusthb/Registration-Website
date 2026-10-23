'use client';
import Link from 'next/link';
import {useState, useEffect, useRef, type FormEvent} from 'react';
import {departments, type DepartmentId} from '@/config/site';
import {restoreDepartmentPreference} from '@/lib/department-preference';
import {useRecruitment} from '@/hooks/use-recruitment';
import {recruitmentDeadlineLabel} from '@/lib/recruitment';
import {VoxelIsland, WorldBrand, WorldButton} from '@/components/world-ui';
type Draft = {
  name: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  year: string;
  choices: DepartmentId[];
  skills: string[];
  interests: string;
  experience: string;
  why: string;
  learn: string;
  contribute: string;
  idea: string;
  portfolio: string;
};
const blank: Draft = {
  name: '',
  email: '',
  phone: '',
  university: 'USTHB',
  major: '',
  year: '',
  choices: [],
  skills: [],
  interests: '',
  experience: '',
  why: '',
  learn: '',
  contribute: '',
  idea: '',
  portfolio: '',
};
const stages = ['Identity', 'Your path', 'Skills', 'Motivation', 'Review'];
const titles = [
  'LET’S GET TO KNOW YOU.',
  'WHERE DO YOU BELONG?',
  'WHAT SKILLS DO YOU BRING?',
  'WHAT DRIVES YOU?',
  'READY TO BEGIN?',
];
const descriptions = [
  'A few details so we can get to know you and stay in touch.',
  'Rank up to three departments you’re curious about. These are interests, not final placements.',
  'What you know, what you’ve tried, and what you’d like to explore. Beginners are welcome.',
  'Your own words are enough. Tell us what brings you here.',
  'Take one last look. You can edit any section before submitting.',
];
const skills = [
  'Python',
  'Machine Learning',
  'Statistics',
  'JavaScript',
  'React',
  'Git & GitHub',
  'Social Media',
  'Copywriting',
  'Figma',
  'Graphic Design',
  'Communication',
  'Project Management',
  'Logistics',
  'Public Speaking',
];
const years = [
  '1st year',
  '2nd year',
  '3rd year',
  '4th year',
  '5th year',
  'Master 1',
  'Master 2',
  'Alumni',
];
const draftKey = 'dsc-application-draft';
export default function RegisterPage() {
  const {closed, expired, checking, unavailable} = useRecruitment();
  const [draft, setDraft] = useState<Draft>(blank);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('');
  const key = useRef('');
  const locked = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const prev = useRef(0);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(draftKey) || 'null');
      if (raw && typeof raw === 'object') {
        const restored = {...blank};
        for (const field of Object.keys(blank) as (keyof Draft)[]) {
          if (field !== 'choices' && field !== 'skills' && typeof raw[field] === 'string')
            restored[field] = raw[field];
        }
        restored.choices = restoreDepartmentPreference(raw.choices);
        restored.skills = Array.isArray(raw.skills)
          ? raw.skills.filter((s: unknown) => typeof s === 'string' && skills.includes(s))
          : [];
        setDraft(restored);
      }
      const oldKey = localStorage.getItem('dsc-application-key');
      key.current = oldKey && /^[0-9a-f-]{36}$/i.test(oldKey) ? oldKey : crypto.randomUUID();
      localStorage.setItem('dsc-application-key', key.current);
    } catch {
      key.current = crypto.randomUUID();
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready && !success)
      try {
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setSaved(true);
      } catch {
        setSaved(false);
      }
  }, [draft, ready, success]);
  useEffect(() => {
    if (prev.current !== step) {
      prev.current = step;
      heading.current?.focus();
      heading.current?.scrollIntoView({block: 'start', behavior: 'instant'});
    }
  }, [step]);
  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((d) => ({...d, [field]: value}));
    setErrors((e) => ({...e, [field]: ''}));
  }
  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (draft.name.trim().length < 2) e.name = 'Enter your full name (at least 2 characters).';
      if (!/^\S+@\S+\.\S+$/.test(draft.email)) e.email = 'Enter a valid email address.';
      if (!draft.university.trim()) e.university = 'Enter your university.';
      if (!draft.major.trim()) e.major = 'Enter your faculty or field of study.';
      if (!years.includes(draft.year)) e.year = 'Select your academic year.';
    }
    if (s === 2 && draft.portfolio) {
      try {
        if (!['https:', 'http:'].includes(new URL(draft.portfolio).protocol)) throw Error();
      } catch {
        e.portfolio = 'Enter a complete http:// or https:// link.';
      }
    }
    if (s === 3) {
      if (!draft.why.trim()) e.why = 'Tell us why you would like to join.';
      if (!draft.contribute.trim()) e.contribute = 'Tell us how you would like to contribute.';
    }
    return e;
  }
  function next() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) {
      setTimeout(() => document.getElementById(Object.keys(e)[0])?.focus(), 0);
      return;
    }
    setStep((s) => s + 1);
    setMessage('');
  }
  function preference(index: number, value: string) {
    const choices = [...draft.choices];
    if (!value) choices.splice(index, 1);
    else {
      const existing = choices.indexOf(value as DepartmentId);
      if (existing !== -1 && existing !== index) {
        choices[existing] = choices[index];
      }
      choices[index] = value as DepartmentId;
    }
    update('choices', choices.filter(Boolean));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (step !== 4 || locked.current || closed || checking || unavailable || !ready) return;
    for (const s of [0, 2, 3]) {
      const e = validate(s);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    if (!consent) {
      setErrors({consent: 'Please read and agree to the application data notice.'});
      return;
    }
    locked.current = true;
    setSending(true);
    setMessage('');
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...draft, consent, applicationKey: key.current}),
      });
      const result = await response.json();
      if (!response.ok)
        throw Error(result.error || 'We couldn’t save your application. Please try again.');
      setReference(result.reference || '');
      setSuccess(true);
      try {
        localStorage.removeItem(draftKey);
        localStorage.removeItem('dsc-application-key');
      } catch {}
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : 'Connection interrupted. Your draft is saved; please try again.'
      );
    } finally {
      locked.current = false;
      setSending(false);
    }
  }
  function input(
    field: Exclude<keyof Draft, 'choices' | 'skills'>,
    label: string,
    options: {
      required?: boolean;
      type?: string;
      area?: boolean;
      placeholder?: string;
      max?: number;
      autoComplete?: string;
    } = {}
  ) {
    const props = {
      id: field,
      value: draft[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        update(field, e.target.value),
      className: 'inventory-field',
      'aria-invalid': Boolean(errors[field]),
      'aria-describedby': errors[field] ? `${field}-error` : undefined,
      required: options.required,
      maxLength: options.max || 2500,
      placeholder: options.placeholder,
      autoComplete: options.autoComplete,
    };
    return (
      <label className="world-field" htmlFor={field}>
        {label}
        {options.required ? ' *' : ' (optional)'}
        {options.area ? (
          <textarea {...props} rows={4} />
        ) : (
          <input {...props} type={options.type || 'text'} />
        )}{' '}
        {errors[field] && (
          <span className="field-error" id={`${field}-error`}>
            {errors[field]}
          </span>
        )}
      </label>
    );
  }
  if (success || closed)
    return (
      <main className="application-world">
        <header className="world-container world-header">
          <WorldBrand />
          <Link href="/" className="world-text-link">
            BACK TO HOME ↗
          </Link>
        </header>
        <section className="world-confirmation world-container">
          <div>
            <p className="world-kicker">
              {success ? 'DSC / FIRST QUEST COMPLETE' : 'DSC / RECRUITMENT UPDATE'}
            </p>
            <h1>
              {success ? (
                <>
                  ACHIEVEMENT
                  <br />
                  <em>UNLOCKED!</em>
                </>
              ) : (
                <>
                  THIS CHAPTER
                  <br />
                  IS <em>CLOSED.</em>
                </>
              )}
            </h1>
            <h2>{success ? 'YOUR APPLICATION HAS BEEN SUBMITTED.' : 'APPLICATIONS ARE CLOSED.'}</h2>
            <p>
              {success
                ? 'Your first quest is complete. Our team will review your application. Stay tuned for the next chapter.'
                : expired
                  ? `This round closed on ${recruitmentDeadlineLabel}. Your saved draft stays on this device.`
                  : 'Recruitment is currently paused. Your saved draft stays on this device. Please check back later.'}
            </p>
            {success && (
              <p>
                We’ll contact you at <strong>{draft.email}</strong>. Submission does not mean
                acceptance.
              </p>
            )}
            {reference && (
              <p className="application-reference">
                APPLICATION REFERENCE
                <br />
                <strong>{reference}</strong>
              </p>
            )}
            <div className="world-actions">
              <WorldButton href="/">BACK TO HOME</WorldButton>
              {success && process.env.NEXT_PUBLIC_DSC_INSTAGRAM_URL && (
                <a
                  className="world-text-link"
                  href={process.env.NEXT_PUBLIC_DSC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  FOLLOW US ON INSTAGRAM ↗
                </a>
              )}
            </div>
          </div>
          <VoxelIsland
            index={success ? 8 : 6}
            label={
              success
                ? 'A student discovers a treasure chest on a floating Minecraft island'
                : 'Two connected Minecraft islands'
            }
          />
        </section>
      </main>
    );
  return (
    <main className="application-world">
      <header className="world-container world-header">
        <WorldBrand />
        <Link href="/" className="world-text-link">
          BACK TO THE WORLD ↗
        </Link>
      </header>
      <div className="application-layout world-container">
        <aside className="application-sidebar">
          <p className="world-kicker">YOUR FIRST QUEST</p>
          <h2>
            CREATE YOUR
            <br />
            <em>PLAYER PROFILE.</em>
          </h2>
          <p>
            A little about you.
            <br />A whole world ahead.
          </p>
          <VoxelIsland
            index={step === 1 ? 4 : step === 4 ? 8 : 7}
            label="Your application journey in DataScience World"
          />
          <p className="application-closes">
            APPLICATIONS CLOSE
            <br />
            <strong>{recruitmentDeadlineLabel}</strong>
          </p>
          <Link href="/privacy" className="world-text-link">
            How we use your information ↗
          </Link>
        </aside>
        <div className="application-form-shell">
          <div className="application-progress-head">
            <span>APPLICATION / 0{step + 1} OF 05</span>
            <span role="status">
              {ready
                ? saved
                  ? 'Draft saved on this device'
                  : 'Draft unavailable — keep this page open'
                : 'Loading draft…'}
            </span>
          </div>
          <nav className="application-progress" aria-label="Application steps">
            {stages.map((name, i) => (
              <button
                type="button"
                key={name}
                disabled={i > step || sending}
                onClick={() => {
                  setStep(i);
                  setMessage('');
                  setErrors({});
                }}
                aria-current={i === step ? 'step' : undefined}
              >
                <span>{i < step ? '✓' : `0${i + 1}`}</span>
                {name}
              </button>
            ))}
          </nav>
          {unavailable && (
            <p className="form-alert" role="status">
              We can’t check recruitment status right now. You can prepare your draft; submission
              will be available when the connection returns.
            </p>
          )}
          <form onSubmit={submit} noValidate>
            <fieldset disabled={sending || !ready} className="application-fieldset">
              <div className="application-step-heading">
                <p className="world-kicker">
                  {step === 4
                    ? 'FINAL CHECKPOINT'
                    : `STEP 0${step + 1} / ${stages[step].toUpperCase()}`}
                </p>
                <h1 ref={heading} tabIndex={-1}>
                  {titles[step]}
                </h1>
                <p>{descriptions[step]}</p>
              </div>
              {step === 0 && (
                <div className="form-grid">
                  {input('name', 'Full name', {
                    required: true,
                    max: 120,
                    autoComplete: 'name',
                    placeholder: 'Your full name',
                  })}
                  {input('email', 'Email address', {
                    required: true,
                    type: 'email',
                    max: 254,
                    autoComplete: 'email',
                    placeholder: 'you@example.com',
                  })}
                  {input('phone', 'Phone / WhatsApp', {type: 'tel', max: 40, autoComplete: 'tel'})}
                  {input('university', 'University', {required: true, max: 140})}
                  {input('major', 'Faculty / Field of Study', {required: true, max: 140})}
                  <label className="world-field" htmlFor="year">
                    Academic year *
                    <select
                      id="year"
                      className="inventory-field"
                      value={draft.year}
                      onChange={(e) => update('year', e.target.value)}
                      aria-invalid={Boolean(errors.year)}
                      aria-describedby={errors.year ? 'year-error' : undefined}
                      required
                    >
                      <option value="">Select your year</option>
                      {years.map((y) => (
                        <option key={y}>{y}</option>
                      ))}
                    </select>
                    {errors.year && (
                      <span className="field-error" id="year-error">
                        {errors.year}
                      </span>
                    )}
                  </label>
                </div>
              )}
              {step === 1 && (
                <div className="ranked-preferences">
                  <p className="preference-notice">
                    Not sure yet? You can leave these blank. The team will discuss the right fit
                    with you.
                  </p>
                  {[0, 1, 2].map((i) => {
                    const idx = departments.findIndex((d) => d.id === draft.choices[i]);
                    return (
                      <div className="ranked-preference" key={i}>
                        {idx >= 0 ? (
                          <VoxelIsland index={idx} label="" />
                        ) : (
                          <span className="preference-empty" aria-hidden="true">{`0${i + 1}`}</span>
                        )}
                        <label htmlFor={`preference-${i}`}>
                          PREFERENCE 0{i + 1}
                          <select
                            id={`preference-${i}`}
                            className="inventory-field"
                            disabled={i > draft.choices.length}
                            value={draft.choices[i] || ''}
                            onChange={(e) => preference(i, e.target.value)}
                          >
                            <option value="">
                              {i ? 'No additional preference' : 'No preference yet'}
                            </option>
                            {departments.map((d) => (
                              <option
                                key={d.id}
                                value={d.id}
                                disabled={draft.choices.includes(d.id) && draft.choices[i] !== d.id}
                              >
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    );
                  })}
                  <p className="world-note">
                    Priority 01 is your first interest. To change the order, clear a preference and
                    choose again. No duplicates, and no final assignment.
                  </p>
                </div>
              )}
              {step === 2 && (
                <>
                  <div
                    className="skill-grid"
                    role="group"
                    aria-label="Skills you have or want to learn"
                  >
                    {skills.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`skill-slot ${draft.skills.includes(s) ? 'selected' : ''}`}
                        aria-pressed={draft.skills.includes(s)}
                        onClick={() =>
                          update(
                            'skills',
                            draft.skills.includes(s)
                              ? draft.skills.filter((x) => x !== s)
                              : [...draft.skills, s]
                          )
                        }
                      >
                        <span aria-hidden="true">{draft.skills.includes(s) ? '✓' : '+'}</span>
                        {s}
                      </button>
                    ))}
                  </div>
                  {input('experience', 'Previous experience', {
                    area: true,
                    placeholder:
                      'Projects, clubs, events, hackathons or workshops you’ve been part of. Starting out? That’s welcome too.',
                  })}
                  {input('interests', 'Other skills or interests', {area: true, max: 1500})}
                  {input('portfolio', 'Portfolio / GitHub / LinkedIn', {
                    type: 'url',
                    max: 400,
                    placeholder: 'https://',
                  })}
                </>
              )}
              {step === 3 && (
                <>
                  {input('why', 'Why do you want to join Data Science Club?', {
                    area: true,
                    required: true,
                  })}
                  {input('learn', 'What do you hope to learn?', {area: true})}
                  {input('contribute', 'How could you contribute?', {area: true, required: true})}
                  {input('idea', 'An idea or project you would like to develop', {area: true})}
                </>
              )}
              {step === 4 && (
                <>
                  <div className="world-review">
                    {[
                      [
                        'Identity',
                        0,
                        `${draft.name}\n${draft.email}\n${draft.phone || 'No phone provided'}\n${draft.university} · ${draft.major}\n${draft.year}`,
                      ],
                      [
                        'Department preferences',
                        1,
                        draft.choices.length
                          ? draft.choices
                              .map(
                                (id, i) => `${i + 1}. ${departments.find((d) => d.id === id)?.name}`
                              )
                              .join('\n')
                          : 'No preference yet',
                      ],
                      [
                        'Skills & experience',
                        2,
                        `${draft.skills.join(' · ') || 'No skills selected'}\n\nExperience: ${draft.experience || 'Not provided'}\nOther interests: ${draft.interests || 'Not provided'}\nPortfolio: ${draft.portfolio || 'Not provided'}`,
                      ],
                      [
                        'Motivation',
                        3,
                        `Why DSC: ${draft.why}\n\nLearning goals: ${draft.learn || 'Not provided'}\n\nContribution: ${draft.contribute}\n\nProject idea: ${draft.idea || 'Not provided'}`,
                      ],
                    ].map(([title, s, content]) => (
                      <section key={title}>
                        <div>
                          <h2>{title}</h2>
                          <button
                            type="button"
                            onClick={() => setStep(Number(s))}
                            aria-label={`Edit ${title}`}
                          >
                            Edit ↗
                          </button>
                        </div>
                        <p>{content}</p>
                      </section>
                    ))}
                  </div>
                  <div className="application-consent">
                    <label>
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          setErrors({});
                        }}
                        aria-describedby="consent-notice"
                        aria-invalid={Boolean(errors.consent)}
                      />
                      <span>
                        I agree that Data Science Club may use my application information to review
                        my candidacy and contact me about recruitment. *
                      </span>
                    </label>
                    <p id="consent-notice">
                      Read the{' '}
                      <Link href="/privacy" target="_blank">
                        application data notice
                      </Link>
                      . Your information is accessible to authorized recruitment administrators.
                    </p>
                    {errors.consent && (
                      <p className="field-error" role="alert">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </>
              )}
              {message && (
                <p className="form-alert" role="alert">
                  {message}
                </p>
              )}
              <div className="form-controls">
                {step > 0 ? (
                  <button
                    type="button"
                    className="game-button secondary"
                    onClick={() => {
                      setStep((s) => s - 1);
                      setErrors({});
                      setMessage('');
                    }}
                  >
                    ← Back
                  </button>
                ) : (
                  <span className="form-note">* Required fields</span>
                )}
                {step < 4 ? (
                  <button
                    key="continue"
                    type="button"
                    className="game-button"
                    onClick={(e) => {
                      e.preventDefault();
                      next();
                    }}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    key="submit"
                    type="submit"
                    className="game-button"
                    disabled={sending || closed || checking || unavailable}
                  >
                    {sending ? 'Submitting…' : 'SUBMIT APPLICATION'} ↗
                  </button>
                )}
              </div>
            </fieldset>
          </form>
          <p className="application-local-note">
            Your draft is stored in this browser.{' '}
            <button
              type="button"
              disabled={sending}
              onClick={() => {
                setDraft(blank);
                setStep(0);
                setConsent(false);
                setErrors({});
                key.current = crypto.randomUUID();
                try {
                  localStorage.setItem('dsc-application-key', key.current);
                } catch {}
              }}
            >
              Clear my draft
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
