import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: [
        "Florist",                     // Updated positions
        "Event Decorator",
        "Wedding Coordinator",
        "Customer Service Manager",
        "Delivery Manager",
        "Inventory Manager",
        "Sales Representative",
        "Marketing Manager",
        "Warehouse Supervisor",
        "Manager",
        "Developer",
        "Designer",
        "Analyst",
        "Flora Company Worker"          // New position added here
      ],
    },
    mobile: {
      type: String,
      default: '0', // Ensure this is a string
    },
    salary: {
      type: Number,
      default: 0,
    },
    othours: { 
      type: Number, 
      default: 0,
    }, 
    otrate: { 
      type: Number, 
      default: 0,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
