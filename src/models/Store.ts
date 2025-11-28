import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category?: string;
}

export interface IStore extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  storeSlug: string;
  storeDescription?: string;
  currency: string;
  welcomeMessage: string;
  isPublic: boolean;
  storeTheme: string;
  contactEmail?: string;
  storeAddress?: string;
  whatsappNumber: string; // NEW: Store owner's WhatsApp number
  products: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  imageUrl: {
    type: String,
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  category: {
    type: String,
    trim: true,
  },
});

const storeSchema = new Schema<IStore>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    storeSlug: {
      type: String,
      required: [true, 'Store slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Store slug can only contain letters, numbers, and hyphens'],
    },
    storeDescription: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    welcomeMessage: {
      type: String,
      default: 'Welcome to my store! How can I help you today?',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    storeTheme: {
      type: String,
      default: 'default',
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    storeAddress: {
      type: String,
      trim: true,
    },
    whatsappNumber: { // NEW FIELD
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    products: [productSchema],
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from store name before saving
storeSchema.pre('save', function(next) {
  if (this.isModified('storeName') && !this.storeSlug) {
    this.storeSlug = this.storeName
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Check if model already exists to prevent OverwriteModelError
export const Store: Model<IStore> = 
  mongoose.models.Store || mongoose.model<IStore>('Store', storeSchema);