'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function RegisterPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const answers = Object.fromEntries(siteConfig.registrationFields.map((field) => [field.name, String(data.get(field.name) ?? '')]));

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.get('name'), email: data.get('email'), phone: data.get('phone'), answers }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Your registration could not be saved.');
      setStatus('success');
      setMessage('You are on the list. Look out for a confirmation from the organizers.');
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <main className="min-h-screen bg-[#10120f] px-5 py-8 text-[#f6f6ef] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"><ArrowLeft className="size-4" /> Back to {siteConfig.organization}</Link>
        <div className="mt-10 grid overflow-hidden rounded-[2rem] border border-white/10 bg-[#171a15] md:grid-cols-[.85fr_1.15fr]">
          <aside className="flex flex-col justify-between bg-[var(--accent)] p-7 text-[#171b11] sm:p-10">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] opacity-60">{siteConfig.organization}</p><p className="mt-14 max-w-sm text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">{siteConfig.eventName}</p><p className="mt-5 max-w-sm text-sm leading-6 opacity-70">{siteConfig.registrationNote}</p></div>
            <div className="mt-12 border-t border-black/15 pt-5 text-sm"><p>{siteConfig.date}</p><p className="mt-1 opacity-65">{siteConfig.location}</p></div>
          </aside>
          <div className="p-6 sm:p-10">
            {status === 'success' ? <div className="flex min-h-[430px] flex-col items-start justify-center"><CheckCircle2 className="size-12 text-[var(--accent)]" /><h1 className="mt-6 text-3xl font-semibold tracking-tight">You&apos;re registered.</h1><p className="mt-3 max-w-md text-sm leading-6 text-white/60">{message}</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#171b11]">Back to home <ArrowRight className="size-4" /></Link></div> : <>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--accent)]">Registration</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Save your spot.</h1><p className="mt-2 text-sm text-white/55">Fill in your details and we&apos;ll be in touch.</p>
              <form className="mt-8 space-y-5" onSubmit={submit}>
                <label className="block text-sm font-medium">Your name <span className="text-[var(--accent)]">*</span><input name="name" required autoComplete="name" maxLength={120} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-[var(--accent)]/60" placeholder="Full name" /></label>
                <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium">Email address <span className="text-[var(--accent)]">*</span><input name="email" type="email" required autoComplete="email" maxLength={254} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-[var(--accent)]/60" placeholder="you@example.com" /></label><label className="block text-sm font-medium">Phone <span className="text-xs font-normal text-white/35">optional</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-[var(--accent)]/60" placeholder="Your phone number" /></label></div>
                {siteConfig.registrationFields.map((field) => <label key={field.name} className="block text-sm font-medium">{field.label} {field.required && <span className="text-[var(--accent)]">*</span>}{field.type === 'textarea' ? <textarea name={field.name} required={field.required} maxLength={2000} rows={3} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-[var(--accent)]/60" /> : <input name={field.name} type={field.type} required={field.required} maxLength={200} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-[var(--accent)]/60" />}</label>)}
                {message && <p role="alert" className={`rounded-xl border px-4 py-3 text-sm ${status === 'error' ? 'border-red-400/25 bg-red-400/10 text-red-200' : 'border-white/10 text-white/65'}`}>{message}</p>}
                <button type="submit" disabled={status === 'submitting'} className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold text-[#171b11] transition hover:bg-[#d4fa83] disabled:cursor-wait disabled:opacity-60">{status === 'submitting' ? 'Submitting…' : 'Complete registration'} {!status.startsWith('sub') && <ArrowRight className="ml-2 size-4" />}</button>
                <p className="text-center text-xs leading-5 text-white/35">By registering, you agree that the organizers may contact you about this event.</p>
              </form>
            </>}
          </div>
        </div>
      </div>
    </main>
  );
}
