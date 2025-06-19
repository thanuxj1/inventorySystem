import mongoose from 'mongoose';

const StockReturnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },

    category:{
      type: String,
      required: true
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming supplierId is an ObjectId from another collection
      required: true,
      ref: 'Supplier' // Reference to the Supplier model (if applicable)
    },
  
  },
  { timestamps: true }
);

const StockReturn = mongoose.model('StockReturn', StockReturnSchema);

export default StockReturn;