import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import employeeRouter from './routes/employee.route.js';
import leaveRouter from './routes/leave.route.js';
import eventRouter from './routes/event.route.js';
import packageRouter from './routes/package.route.js';
import stockRouter from "./routes/stock.route.js";
import supplierRouter from "./routes/supplier.route.js";
import purchaceRouter from "./routes/purchases.route.js";
import customerRouter from './routes/customer.route.js';
import clientRouter from './routes/client.route.js'; // Import the client router

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000!!!');
});

app.use('/api/employee', employeeRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/event', eventRouter);
app.use('/api/package', packageRouter);
app.use("/api/stock", stockRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/purchace", purchaceRouter);
app.use('/api/customer', customerRouter);
app.use('/api/client', clientRouter); // Add client routes



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
});