import {NextResponse} from 'next/server';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';
import {siteConfig} from '@/config/site';

import {parseDepartmentPreference} from '@/lib/department-preference';
import {isRecruitmentClosed} from '@/lib/recruitment';
import {getRecruitmentState} from '@/lib/recruitment-settings';

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

  if (payload.consent !== true)
    return NextResponse.json(
      {error: 'Please read and agree to the application data notice.'},
      {status: 400}
    );
  const applicationKey = string(payload.applicationKey, 80);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(applicationKey)
  )
    return NextResponse.json(
      {error: 'Invalid application session. Reload and try again.'},
      {status: 400}
    );
  const name = string(payload.name, 120);
  const email = string(payload.email, 254).toLowerCase();
  const phone = string(payload.phone, 40);
  const university = string(payload.university, 140);
  const major = string(payload.major, 140);
  const year = string(payload.year, 30);
  const choices = parseDepartmentPreference(payload.choices);
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
  if (choices === null)
    return NextResponse.json(
      {
        error:
          'Rank up to three valid departments without duplicates, or leave your preferences empty.',
      },
      {status: 400}
    );
  if (!why || !contribute)
    return NextResponse.json(
      {error: 'Tell us why you want to join and how you would like to contribute.'},
      {status: 400}
    );
  let validPortfolio = true;
  if (portfolio) {
    try {
      validPortfolio = ['http:', 'https:'].includes(new URL(portfolio).protocol);
    } catch {
      validPortfolio = false;
    }
  }
  if (!validPortfolio)
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
    const recruitment = await getRecruitmentState();
    if (!recruitment.open)
      return NextResponse.json({error: 'Recruitment is currently closed.'}, {status: 403});
    await dbConnect();
    const existing = await Submission.findOne({applicationKey})
      .select('_id')
      .lean<{_id: unknown} | null>();
    if (existing)
      return NextResponse.json({success: true, reference: `DSC-${existing._id}`}, {status: 200});
    const submission = await Submission.create({
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
      experience: string(payload.experience, 2500),
      learn: string(payload.learn, 2500),
      idea: string(payload.idea, 2500),
      applicationKey,
      consentAt: new Date(),
      privacyVersion: '2026-10-23',
      status: 'new',
    });
    return NextResponse.json({success: true, reference: `DSC-${submission._id}`}, {status: 201});
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      const existing = await Submission.findOne({applicationKey})
        .select('_id')
        .lean<{_id: unknown} | null>()
        .catch(() => null);
      if (existing)
        return NextResponse.json({success: true, reference: `DSC-${existing._id}`}, {status: 200});
    }
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
