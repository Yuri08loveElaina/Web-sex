import mongoose, { Document, Schema } from 'mongoose';

export interface ILink extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

LinkSchema.index({ userId: 1, order: 1 });

export default mongoose.model<ILink>('Link', LinkSchema);
