import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStoreView extends Document {
  storeId: mongoose.Types.ObjectId;
  sessionId: string; // To track unique visits (not individual users)
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  referrer?: string;
  landingPage: string;
  createdAt: Date;
}

const storeViewSchema = new Schema<IStoreView>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    region: {
      type: String,
    },
    timezone: {
      type: String,
    },
    referrer: {
      type: String,
    },
    landingPage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for store views with session tracking
storeViewSchema.index({ storeId: 1, sessionId: 1 });
storeViewSchema.index({ storeId: 1, createdAt: 1 });

// Check if model already exists to prevent OverwriteModelError
export const StoreView: Model<IStoreView> = 
  mongoose.models.StoreView || mongoose.model<IStoreView>('StoreView', storeViewSchema);