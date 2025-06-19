import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
  
  },
  { timestamps: true }
);

const Stock = mongoose.model('Stock', StockSchema);

export default Stock;