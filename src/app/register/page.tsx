'use client';

import Link from 'next/link';
import {FormEvent, useEffect, useRef, useState} from 'react';
import {departments, type DepartmentId} from '@/config/site';
import {restoreDepartmentPreference} from '@/lib/department-preference';
import {useRecruitment} from '@/hooks/use-recruitment';
import {recruitmentClosesAt, recruitmentDeadlineLabel} from '@/lib/recruitment';

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
  why: string;
  contribute: string;
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
  why: '',
  contribute: '',
  portfolio: '',
};
const steps = ['About you', 'Interests', 'Skills', 'Motivation', 'Review'];
const skillOptions = [
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
const field = 'inventory-field';

export default function RegisterPage() {
  const {closed, remaining} = useRecruitment();
  const [draft, setDraft] = useState<Draft>(blank);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const previousStep = useRef(0);
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    const heading = document.querySelector<HTMLElement>('.page-heading');
    heading?.focus({preventScroll: true});
    heading?.scrollIntoView({block: 'start', behavior: 'instant'});
  }, [step]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dsc-application-draft');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Draft>;
        setDraft({...blank, ...parsed, choices: restoreDepartmentPreference(parsed.choices)});
      }
      const preferred = new URLSearchParams(location.search).get(
        'department'
      ) as DepartmentId | null;
      if (preferred && departments.some((d) => d.id === preferred))
        setDraft((prev) => (prev.choices.length ? prev : {...prev, choices: [preferred]}));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready && status !== 'success') {
      try {
        localStorage.setItem('dsc-application-draft', JSON.stringify(draft));
        setDraftSaved(true);
      } catch {
        setDraftSaved(false);
      }
    }
  }, [draft, ready, status]);
  const preferredDepartment = departments.find((department) => department.id === draft.choices[0]);
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({...prev, [key]: value}));
  }
  function validStep() {
    if (step === 0) {
      if (
        draft.name.trim().length < 2 ||
        !/^\S+@\S+\.\S+$/.test(draft.email) ||
        !draft.university.trim() ||
        !draft.major.trim() ||
        !draft.year
      ) {
        setMessage(
          'Complete your name, email, university, major, and academic year before continuing.'
        );
        return false;
      }
    }
    if (step === 3 && (!draft.why.trim() || !draft.contribute.trim())) {
      setMessage('Please answer both questions before continuing.');
      return false;
    }
    if (step === 3 && draft.portfolio) {
      try {
        const url = new URL(draft.portfolio);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch {
        setMessage('Enter a complete portfolio URL beginning with https:// or http://.');
        return false;
      }
    }
    setMessage('');
    return true;
  }
  function next() {
    if (validStep()) setStep(Math.min(step + 1, 4));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (step !== 4 || closed) return;
    if (!validStep()) return;
    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(draft),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Application could not be saved.');
      setStatus('success');
      try {
        localStorage.removeItem('dsc-application-draft');
      } catch {}
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Application could not be saved.');
    }
  }
  if (status === 'success')
    return (
      <main className="registration-screen">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link href="/" className="game-back">
            ← Back to the club
          </Link>
          <section className="inventory-panel success-panel">
            <span className="eyebrow">DSC RECRUITMENT</span>
            <h1>Application received</h1>
            <p>
              Your application is now in the DSC review queue. The club team will contact you at{' '}
              <b>{draft.email}</b>.
            </p>
            <Link className="game-button" href="/">
              Back to the club
            </Link>
          </section>
        </div>
      </main>
    );
  if (closed)
    return (
      <main className="registration-screen">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link href="/" className="game-back">
            ← Back to the club
          </Link>
          <section className="inventory-panel success-panel">
            <span className="eyebrow">DSC RECRUITMENT</span>
            <h1>Applications are closed</h1>
            <p>
              This recruitment round ended on {recruitmentDeadlineLabel}. Your saved draft remains
              on this device, but new applications are no longer accepted.
            </p>
            <Link className="game-button primary" href="/">
              Explore the club
            </Link>
          </section>
        </div>
      </main>
    );
  return (
    <main className="registration-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="game-back">
            ← Back to the club
          </Link>
          <span className="save-indicator">
            {ready
              ? draftSaved
                ? 'Draft saved on this device'
                : 'Draft not saved — keep this page open'
              : 'Loading your draft…'}
          </span>
        </div>
        <div className="registration-deadline">
          <time dateTime={recruitmentClosesAt}>Closes {recruitmentDeadlineLabel}</time>
          <span>
            {remaining
              ? `${remaining.days}d ${remaining.hours}h ${remaining.minutes}m left to submit`
              : 'Submit before the closing date'}
          </span>
        </div>
        <div className="inventory-panel mt-6">
          <div className="inventory-topline">
            <div>
              <span className="eyebrow">DATA SCIENCE CLUB · USTHB</span>
              <h1>Apply to the club</h1>
            </div>
            <img
              className="application-logo"
              src="/dsc-logo.svg"
              alt="Data Science Club"
              width="50"
              height="50"
            />
          </div>
          <div className="step-list" aria-label="Application steps">
            {steps.map((name, index) => (
              <button
                type="button"
                key={name}
                onClick={() => {
                  if (index < step) setStep(index);
                }}
                className={`step-tab${index === step ? ' current' : ''}${index < step ? ' complete' : ''}`}
                disabled={index > step}
                aria-current={index === step ? 'step' : undefined}
              >
                <span>{index < step ? '✓' : index + 1}</span>
                {name}
              </button>
            ))}
          </div>
          <form onSubmit={submit}>
            {step === 0 && (
              <section className="application-page">
                <div className="page-heading" tabIndex={-1}>
                  <span>Let’s start with you.</span>
                  <p>A few details so we can get to know you and stay in touch.</p>
                </div>
                <div className="form-grid">
                  <label>
                    Full name *
                    <input
                      className={field}
                      value={draft.name}
                      onChange={(e) => update('name', e.target.value)}
                      autoComplete="name"
                      maxLength={120}
                      required
                      placeholder="Your full name"
                    />
                  </label>
                  <label>
                    Email address *
                    <input
                      className={field}
                      type="email"
                      value={draft.email}
                      onChange={(e) => update('email', e.target.value)}
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      maxLength={254}
                    />
                  </label>
                  <label>
                    Phone / WhatsApp (optional)
                    <input
                      className={field}
                      type="tel"
                      value={draft.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      autoComplete="tel"
                      placeholder="Optional"
                      maxLength={40}
                    />
                  </label>
                  <label>
                    University *
                    <input
                      className={field}
                      value={draft.university}
                      onChange={(e) => update('university', e.target.value)}
                      required
                      maxLength={140}
                    />
                  </label>
                  <label>
                    Faculty / major *
                    <input
                      className={field}
                      value={draft.major}
                      onChange={(e) => update('major', e.target.value)}
                      required
                      maxLength={140}
                      placeholder="e.g. Computer Science"
                    />
                  </label>
                  <label>
                    Academic year *
                    <select
                      className={field}
                      value={draft.year}
                      onChange={(e) => update('year', e.target.value)}
                      required
                    >
                      <option value="">Select your year</option>
                      {[
                        '1st year',
                        '2nd year',
                        '3rd year',
                        '4th year',
                        '5th year',
                        'Master 1',
                        'Master 2',
                        'Alumni',
                      ].map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>
            )}
            {step === 1 && (
              <section className="application-page">
                <div className="page-heading" tabIndex={-1}>
                  <span>What interests you?</span>
                  <p>You’re applying to the club. You don’t need to choose a department now.</p>
                </div>
                <label className="full-field" htmlFor="department-interest">
                  A department you’re curious about (optional)
                  <select
                    id="department-interest"
                    className={field}
                    aria-describedby="department-interest-help"
                    value={draft.choices[0] || ''}
                    onChange={(event) =>
                      update(
                        'choices',
                        event.target.value ? [event.target.value as DepartmentId] : []
                      )
                    }
                  >
                    <option value="">No preference yet</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p id="department-interest-help" className="preference-explanation">
                  This simply helps us understand your interests. It is not a final choice or a
                  confirmed placement. The club team will discuss the right fit with you. You can
                  leave this blank and continue.
                </p>
              </section>
            )}
            {step === 2 && (
              <section className="application-page">
                <div className="page-heading" tabIndex={-1}>
                  <span>What do you enjoy?</span>
                  <p>
                    Select skills you have or would like to learn. It’s fine to leave this blank.
                  </p>
                </div>
                <div className="skill-grid">
                  {skillOptions.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      aria-pressed={draft.skills.includes(skill)}
                      onClick={() =>
                        update(
                          'skills',
                          draft.skills.includes(skill)
                            ? draft.skills.filter((x) => x !== skill)
                            : [...draft.skills, skill]
                        )
                      }
                      className={`skill-slot${draft.skills.includes(skill) ? ' selected' : ''}`}
                    >
                      <i>{draft.skills.includes(skill) ? '✓' : '+'}</i>
                      {skill}
                    </button>
                  ))}
                </div>
                <label className="full-field">
                  Anything else you’re curious about? (optional)
                  <textarea
                    className={field}
                    value={draft.interests}
                    onChange={(e) => update('interests', e.target.value)}
                    maxLength={1500}
                    rows={4}
                    placeholder="Topics, tools, projects, ideas…"
                  />
                </label>
                <p className="form-note">Optional · {draft.skills.length} skills selected</p>
              </section>
            )}
            {step === 3 && (
              <section className="application-page">
                <div className="page-heading" tabIndex={-1}>
                  <span>Tell us a little more.</span>
                  <p>
                    A few honest words are enough. We’d like to understand what brings you here.
                  </p>
                </div>
                <label className="full-field">
                  Why do you want to join the Data Science Club? *
                  <textarea
                    className={field}
                    value={draft.why}
                    onChange={(e) => update('why', e.target.value)}
                    required
                    maxLength={2500}
                    rows={5}
                    placeholder="Tell us what interests you about DSC…"
                  />
                </label>
                <label className="full-field">
                  What would you like to contribute or learn? *
                  <textarea
                    className={field}
                    value={draft.contribute}
                    onChange={(e) => update('contribute', e.target.value)}
                    required
                    maxLength={2500}
                    rows={5}
                    placeholder="A project, a skill, an idea, or something new…"
                  />
                </label>
                <label className="full-field">
                  Portfolio / GitHub / LinkedIn (optional){' '}
                  <input
                    className={field}
                    type="url"
                    value={draft.portfolio}
                    onChange={(e) => update('portfolio', e.target.value)}
                    maxLength={400}
                    placeholder="https:// (optional)"
                  />
                </label>
              </section>
            )}
            {step === 4 && (
              <section className="application-page">
                <div className="page-heading" tabIndex={-1}>
                  <span>Take one last look.</span>
                  <p>
                    Review your details before sending your application to the recruitment team.
                  </p>
                </div>
                <div className="review-grid">
                  <div className="review-box">
                    <b>About you</b>
                    <p>
                      {draft.name || '—'}
                      <br />
                      {draft.email || '—'}
                      <br />
                      {draft.phone || 'No phone provided'}
                      <br />
                      {draft.university} · {draft.major}
                      <br />
                      {draft.year || '—'}
                    </p>
                    <button type="button" className="text-game" onClick={() => setStep(0)}>
                      Edit details
                    </button>
                  </div>
                  <div className="review-box">
                    <b>Department interest (optional)</b>
                    <p>{preferredDepartment?.name || 'No preference yet'}</p>
                    <p className="form-note">An interest only, not a confirmed placement.</p>
                    <button type="button" className="text-game" onClick={() => setStep(1)}>
                      Edit interest
                    </button>
                  </div>
                  <div className="review-box">
                    <b>Skills & interests</b>
                    <p>{draft.skills.length ? draft.skills.join(' · ') : 'No skills selected'}</p>
                    {draft.interests && <p>{draft.interests}</p>}
                    <button type="button" className="text-game" onClick={() => setStep(2)}>
                      Edit skills
                    </button>
                  </div>
                  <div className="review-box">
                    <b>Your motivation</b>
                    <p>
                      <strong>Why DSC</strong>
                      <br />
                      {draft.why || '—'}
                    </p>
                    <p>
                      <strong>What you’d like to contribute or learn</strong>
                      <br />
                      {draft.contribute || '—'}
                    </p>
                    {draft.portfolio && (
                      <p>
                        <strong>Portfolio</strong>
                        <br />
                        {draft.portfolio}
                      </p>
                    )}
                    <button type="button" className="text-game" onClick={() => setStep(3)}>
                      Edit motivation
                    </button>
                  </div>
                </div>
              </section>
            )}
            {message && (
              <p role="alert" className="form-alert">
                {message}
              </p>
            )}
            <div className="form-controls">
              {step > 0 ? (
                <button
                  type="button"
                  className="game-button secondary"
                  onClick={() => {
                    setMessage('');
                    setStep(step - 1);
                  }}
                >
                  ← Back
                </button>
              ) : (
                <span className="form-note">Fields marked * are required</span>
              )}
              {step < 4 ? (
                <button
                  key="next"
                  type="button"
                  className="game-button"
                  onClick={(event) => {
                    event.preventDefault();
                    next();
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  key="submit"
                  type="submit"
                  className="game-button submit-game"
                  disabled={status === 'sending' || closed}
                >
                  {status === 'sending' ? 'Sending application…' : 'Send application'}{' '}
                  <span>▶</span>
                </button>
              )}
            </div>
          </form>
        </div>
        <p className="registration-footnote">
          Your details are shared with the club’s recruitment team.
        </p>
      </div>
    </main>
  );
}
