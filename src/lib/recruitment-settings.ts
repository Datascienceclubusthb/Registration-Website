import dbConnect from '@/lib/mongoose';
import Recruitment from '@/models/Recruitment';
import {isRecruitmentClosed, recruitmentClosesAt} from '@/lib/recruitment';
export async function getRecruitmentState() {
  if (!process.env.MONGODB_URI) throw new Error('Recruitment storage is unavailable.');
  await dbConnect();
  const settings = await Recruitment.findById('recruitment').lean<{enabled: boolean} | null>();
  const enabled = settings?.enabled ?? true;
  const expired = isRecruitmentClosed();
  return {enabled, expired, open: enabled && !expired, closesAt: recruitmentClosesAt};
}
