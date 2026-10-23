import {NextResponse} from 'next/server';
import {hasAdminSession} from '@/lib/admin-auth';
import dbConnect from '@/lib/mongoose';
import Recruitment from '@/models/Recruitment';
import {getRecruitmentState} from '@/lib/recruitment-settings';
export const runtime = 'nodejs';
export async function PATCH(request: Request) {
  if (!(await hasAdminSession()))
    return NextResponse.json({error: 'Admin sign-in required.'}, {status: 401});
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({error: 'Invalid recruitment setting.'}, {status: 400});
  }
  if (!body || typeof body.enabled !== 'boolean')
    return NextResponse.json({error: 'Enabled must be true or false.'}, {status: 400});
  try {
    await dbConnect();
    await Recruitment.findByIdAndUpdate(
      'recruitment',
      {$set: {enabled: body.enabled}},
      {upsert: true, runValidators: true}
    );
    return NextResponse.json(await getRecruitmentState());
  } catch {
    return NextResponse.json({error: 'Could not update recruitment. Please retry.'}, {status: 503});
  }
}
