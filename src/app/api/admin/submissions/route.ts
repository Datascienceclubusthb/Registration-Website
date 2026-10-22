import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';
import { hasAdminSession } from '@/lib/admin-auth';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Admin sign-in required.' }, { status: 401 });
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: 'MongoDB is not configured.' }, { status: 503 });
  const url = new URL(request.url); const status = url.searchParams.get('status') || ''; const year = url.searchParams.get('year') || ''; const division = url.searchParams.get('division') || ''; const search = url.searchParams.get('search') || '';
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (year) filter.year = year;
  if (division) filter.choices = division;
  if (search) { const safe = search.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); filter.$or = [{ name: { $regex: safe, $options: 'i' } }, { email: { $regex: safe, $options: 'i' } }, { major: { $regex: safe, $options: 'i' } }]; }
  try {
    await dbConnect();
    const [submissions, total, statuses, years] = await Promise.all([
      Submission.find(filter).sort({ createdAt: -1 }).limit(500).lean(),
      Submission.countDocuments(),
      Submission.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Submission.aggregate([{ $group: { _id: '$year', count: { $sum: 1 } } }]),
    ]);
    const divisions = await Submission.aggregate([{ $unwind: '$choices' }, { $group: { _id: '$choices', count: { $sum: 1 } } }]);
    return NextResponse.json({ submissions: JSON.parse(JSON.stringify(submissions)), total, statuses: Object.fromEntries(statuses.map((s: {_id:string;count:number})=>[s._id,s.count])), years: Object.fromEntries(years.map((s: {_id:string;count:number})=>[s._id,s.count])), divisions: Object.fromEntries(divisions.map((s: {_id:string;count:number})=>[s._id,s.count])) });
  } catch { return NextResponse.json({ error: 'Could not load applications from MongoDB.' }, { status: 503 }); }
}
