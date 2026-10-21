import mongoose, { Schema } from 'mongoose';

const SubmissionSchema = new Schema(
  {
    organization: { type: String, required: true },
    eventName: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 40 },
    answers: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
