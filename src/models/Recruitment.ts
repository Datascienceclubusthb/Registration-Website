import mongoose, {Schema} from 'mongoose';
const RecruitmentSchema = new Schema(
  {_id: {type: String}, enabled: {type: Boolean, required: true, default: true}},
  {timestamps: true}
);
export default mongoose.models.Recruitment || mongoose.model('Recruitment', RecruitmentSchema);
