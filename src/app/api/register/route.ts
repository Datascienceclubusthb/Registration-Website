import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';
import { siteConfig } from '@/config/site';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please submit a valid registration.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Please submit a valid registration.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  if (name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || phone.length > 40) {
    return NextResponse.json({ error: 'Enter a valid name and email address.' }, { status: 400 });
  }

  const submittedAnswers = payload.answers && typeof payload.answers === 'object' ? payload.answers as Record<string, unknown> : {};
  const answers: Record<string, string> = {};
  for (const field of siteConfig.registrationFields) {
    const answer = submittedAnswers[field.name];
    const value = typeof answer === 'string' ? answer.trim() : '';
    if (field.required && !value) return NextResponse.json({ error: `${field.label} is required.` }, { status: 400 });
    if (value.length > 2000) return NextResponse.json({ error: `${field.label} is too long.` }, { status: 400 });
    answers[field.name] = value;
  }

  try {
    await dbConnect();
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Registration is not connected yet. Please contact the organizers.' }, { status: 503 });
    }
    await Submission.create({ organization: siteConfig.organization, eventName: siteConfig.eventName, name, email, phone, answers });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    console.error('Registration submission failed. Check the database connection and registration schema.');
    return NextResponse.json({ error: 'We could not save your registration right now. Please try again later.' }, { status: 503 });
  }
}
