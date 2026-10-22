import {NextResponse} from 'next/server';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';
import {departments, siteConfig} from '@/config/site';

import {isRecruitmentClosed} from '@/lib/recruitment';

export const runtime = 'nodejs';

function string(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  if (isRecruitmentClosed()) {
    return NextResponse.json(
      {
        error:
          'This recruitment round is closed. Applications ended on 31 October 2026 at 23:59 (Algiers).',
      },
      {status: 403}
    );
  }
  let payload: Record<string, unknown>;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    payload = body as Record<string, unknown>;
  } catch {
    return NextResponse.json({error: 'Please submit a valid application.'}, {status: 400});
  }

  const name = string(payload.name, 120);
  const email = string(payload.email, 254).toLowerCase();
  const phone = string(payload.phone, 40);
  const university = string(payload.university, 140);
  const major = string(payload.major, 140);
  const year = string(payload.year, 30);
  const choices = Array.isArray(payload.choices)
    ? [...new Set(payload.choices.filter((x): x is string => typeof x === 'string'))].slice(0, 3)
    : [];
  const validDepartments = new Set<string>(departments.map((d) => d.id));
  const skills = Array.isArray(payload.skills)
    ? payload.skills
        .filter((x): x is string => typeof x === 'string')
        .slice(0, 30)
        .map((x) => x.slice(0, 80))
    : [];
  const interests = string(payload.interests, 1500);
  const why = string(payload.why, 2500);
  const contribute = string(payload.contribute, 2500);
  const portfolio = string(payload.portfolio, 400);
  if (
    name.length < 2 ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    phone.length > 40 ||
    !university ||
    !major ||
    ![
      '1st year',
      '2nd year',
      '3rd year',
      '4th year',
      '5th year',
      'Master 1',
      'Master 2',
      'Alumni',
    ].includes(year)
  ) {
    return NextResponse.json(
      {
        error:
          'Complete your player identity with a valid name, email, university, major, and academic year.',
      },
      {status: 400}
    );
  }
  if (!choices.length || choices.length > 3 || choices.some((id) => !validDepartments.has(id)))
    return NextResponse.json(
      {error: 'Choose between one and three valid department paths.'},
      {status: 400}
    );
  if (!why || !contribute)
    return NextResponse.json(
      {error: 'Answer both quest questions before submitting.'},
      {status: 400}
    );
  if (portfolio && !/^https?:\/\//i.test(portfolio))
    return NextResponse.json(
      {error: 'Portfolio links must start with http:// or https://.'},
      {status: 400}
    );

  if (!process.env.MONGODB_URI)
    return NextResponse.json(
      {error: 'Applications are not connected yet. Please contact the organizers.'},
      {status: 503}
    );
  try {
    await dbConnect();
    await Submission.create({
      organization: siteConfig.organization,
      eventName: siteConfig.eventName,
      name,
      email,
      phone,
      university,
      major,
      year,
      choices,
      skills,
      interests,
      why,
      contribute,
      portfolio,
      status: 'new',
    });
    return NextResponse.json({success: true}, {status: 201});
  } catch (error) {
    console.error(
      'Application submission failed:',
      error instanceof Error ? error.message : 'unknown error'
    );
    return NextResponse.json(
      {error: 'We could not save your application right now. Please try again later.'},
      {status: 503}
    );
  }
}
