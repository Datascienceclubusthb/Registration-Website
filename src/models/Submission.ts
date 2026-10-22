import mongoose, { Schema } from 'mongoose';

const SubmissionSchema = new Schema(
  {
    organization: { type: String, required: true, default: 'Data Science Club' },
    eventName: { type: String, required: true, default: 'DSC Recruitment' },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, index: true },
    phone: { type: String, trim: true, maxlength: 40 },
    university: { type: String, required: true, maxlength: 140 },
    major: { type: String, required: true, maxlength: 140 },
    year: { type: String, required: true, maxlength: 30, index: true },
    choices: { type: [String], required: true, validate: (choices: string[]) => choices.length > 0 && choices.length <= 3 },
    skills: { type: [String], default: [] },
    interests: { type: String, maxlength: 1500 },
    why: { type: String, required: true, maxlength: 2500 },
    contribute: { type: String, required: true, maxlength: 2500 },
    portfolio: { type: String, maxlength: 400 },
    status: { type: String, enum: ['new', 'under_review', 'interview', 'accepted', 'rejected'], default: 'new', index: true },
    adminNote: { type: String, maxlength: 4000, default: '' },
    answers: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
