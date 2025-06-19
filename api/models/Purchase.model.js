// models/Purchase.js
import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

// Export the Purchase model
export default mongoose.model('Purchase', PurchaseSchema);
