import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
 // Custom ID if you are using one
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  company: { type: String },
  address: { type: String },
  clientType: { type: String,
    required: false,},
  
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
