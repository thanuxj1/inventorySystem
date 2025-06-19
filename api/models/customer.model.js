import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  phoneNumber: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
