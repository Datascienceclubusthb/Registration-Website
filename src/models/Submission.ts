import mongoose, {Schema} from 'mongoose';
import {parseDepartmentPreference} from '@/lib/department-preference';

const SubmissionSchema = new Schema(
  {
    organization: {type: String, required: true, default: 'Data Science Club'},
    eventName: {type: String, required: true, default: 'DSC Recruitment'},
    name: {type: String, required: true, trim: true, maxlength: 120},
    email: {type: String, required: true, trim: true, lowercase: true, maxlength: 254, index: true},
    phone: {type: String, trim: true, maxlength: 40},
    university: {type: String, required: true, maxlength: 140},
    major: {type: String, required: true, maxlength: 140},
    year: {type: String, required: true, maxlength: 30, index: true},
    // Ranked, non-binding interests. Historical submissions remain compatible.
    choices: {
      type: [String],
      default: [],
      validate: (choices: string[]) => parseDepartmentPreference(choices) !== null,
    },
    skills: {type: [String], default: []},
    interests: {type: String, maxlength: 1500},
    why: {type: String, required: true, maxlength: 2500},
    contribute: {type: String, required: true, maxlength: 2500},
    portfolio: {type: String, maxlength: 400},
    experience: {type: String, maxlength: 2500},
    learn: {type: String, maxlength: 2500},
    idea: {type: String, maxlength: 2500},
    applicationKey: {type: String, unique: true, sparse: true},
    consentAt: {type: Date},
    privacyVersion: {type: String},
    status: {
      type: String,
      enum: ['new', 'under_review', 'interview', 'accepted', 'rejected'],
      default: 'new',
      index: true,
    },
    adminNote: {type: String, maxlength: 4000, default: ''},
    answers: {type: Schema.Types.Mixed, default: {}},
  },
  {timestamps: true}
);

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
