import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface IOrder extends Document {
  storeId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  items: IOrderItem[];
  totalAmount: number;
  orderStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  imageUrl: {
    type: String,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
    },
    customerAddress: {
      type: String,
      trim: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Fixed order number generation
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      // Find the latest order number for today
      const latestOrder = await mongoose.model('Order').findOne({
        orderNumber: new RegExp(`^ORD${year}${month}${day}`)
      }).sort({ createdAt: -1 });
      
      let sequence = 1;
      if (latestOrder && latestOrder.orderNumber) {
        const lastSequence = parseInt(latestOrder.orderNumber.slice(-4), 10);
        sequence = isNaN(lastSequence) ? 1 : lastSequence + 1;
      }
      
      this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
      console.log('🔢 Generated order number:', this.orderNumber);
    } catch (error) {
      console.error('❌ Error generating order number:', error);
      // Fallback order number
      this.orderNumber = `ORD${Date.now()}`;
    }
  }
  next();
});

// Check if model already exists to prevent OverwriteModelError
export const Order: Model<IOrder> = 
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
