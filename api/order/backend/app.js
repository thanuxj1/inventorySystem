
//PPVDhfUhvgq67yI4

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./Routes/UserRoutes');  // User routes
const customerRoutes = require('./Routes/customerRoute.js');  // Customer routes

const app = express();
const PORT = process.env.PORT || 1999;  // Define the port

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Use routes
app.use('/users', userRoutes);  // User routes
app.use('/customers', customerRoutes);  // Customer routes

// MongoDB connection string - ensure that the username, password, and cluster URL are correct
mongoose.connect('mongodb+srv://flower:flower123@mern-flower.ryxgv.mongodb.net/?retryWrites=true&w=majority&appName=mern-flower')
  .then(() => {
    // console.log('Connected to MongoDB');
    // Start the server after successful MongoDB connection
    app.listen(PORT, () => {
      // console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    // console.error('Error connecting to MongoDB:', err);
  });
