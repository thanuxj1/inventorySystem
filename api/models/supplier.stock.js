import mongoose from "mongoose";

const SupplierStockSchema = new mongoose.Schema(
  {
    itname: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming supplierId is an ObjectId from another collection
      required: true,
      ref: 'Supplier' // Reference to the Supplier model (if applicable)
    },
  },
  { timestamps: true }
);

const SupplierStock = mongoose.model("SuppStock", SupplierStockSchema);

export default SupplierStock;
