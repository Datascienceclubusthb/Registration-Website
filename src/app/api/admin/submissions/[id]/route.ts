import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';
import { hasAdminSession } from '@/lib/admin-auth';
export const runtime = 'nodejs';
const statuses = ['new','under_review','interview','accepted','rejected'];
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Admin sign-in required.' }, { status: 401 });
  const { id } = await context.params; if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  let body: {status?:unknown;adminNote?:unknown}; try { body = await request.json(); } catch { return NextResponse.json({error:'Invalid update.'},{status:400}); }
  const update: Record<string,string> = {};
  if (body.status !== undefined) { if (typeof body.status !== 'string' || !statuses.includes(body.status)) return NextResponse.json({error:'Choose a valid review status.'},{status:400}); update.status=body.status; }
  if (body.adminNote !== undefined) { if (typeof body.adminNote !== 'string' || body.adminNote.length > 4000) return NextResponse.json({error:'Admin notes are too long.'},{status:400}); update.adminNote=body.adminNote.trim(); }
  if (!Object.keys(update).length) return NextResponse.json({error:'No changes provided.'},{status:400});
  try { await dbConnect(); const result=await Submission.findByIdAndUpdate(id,{$set:update},{new:true}).lean(); if(!result)return NextResponse.json({error:'Application not found.'},{status:404}); return NextResponse.json({submission:JSON.parse(JSON.stringify(result))}); } catch { return NextResponse.json({error:'Could not update this application.'},{status:503}); }
}
