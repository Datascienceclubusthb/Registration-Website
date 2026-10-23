import {NextResponse} from 'next/server';
import {getRecruitmentState} from '@/lib/recruitment-settings';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    return NextResponse.json(await getRecruitmentState(), {headers: {'Cache-Control': 'no-store'}});
  } catch {
    return NextResponse.json(
      {error: 'Recruitment status is temporarily unavailable.'},
      {status: 503, headers: {'Cache-Control': 'no-store'}}
    );
  }
}
