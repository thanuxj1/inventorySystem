import Stock from "../models/stock.model.js";
import StockReturn from "../models/stock.return.model.js";
import Supplier from "../models/supplier.model.js";
import nodemailer from "nodemailer";

export const addStock = async (req, res, next) => {
  try {
    // Create stock entry without supplier ID
    const stocking = await Stock.create(req.body);

    // Respond with the created stock entry
    return res.status(201).json({
      stocking, // The new stock entry details
      message: "Stock added successfully",
    });
  } catch (error) {
    // Catch any unexpected errors and pass them to the next error handler middleware
    next(error);
  }
};

export const getAllStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find();
    return res.status(200).json(stocks);
  } catch (error) {
    next(error);
  }
};

export const deleteStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Stock.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStock = await Stock.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json(updatedStock);
  } catch (error) {
    next(error);
  }
};

export const addReturnItems = async (req, res, next) => {
  try {
    // Get supplier ID from request body
    const { supplierId } = req.body;

    // Find supplier by ID to get the email
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Create stock return item
    const stocking = await StockReturn.create(req.body);

    // Set up the email transport service using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use a different service like 'SendGrid', 'SMTP', etc.
      auth: {
        user: 'wup0327@gmail.com', // your email address
        pass: 'gopwqpqididmzhwq' // your email password or app-specific password
      }
    });

    // Prepare email details
    const mailOptions = {
      from: 'wup0327@gmail.com', // sender address
      to: supplier.email, // supplier email
      subject: 'Return Stock Notification',
      text: `Hello, ${supplier.name}. You have a new return stock item.\n\nDetails:\nName: ${stocking.name}\nDescription: ${stocking.description}\nQuantity: ${stocking.quantity}\nCategory: ${stocking.category}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with the created stocking item
    return res.status(201).json(stocking);
  } catch (error) {
    next(error);
  }
};

export const viewReturnItems = async (req, res, next) => {
  try {
    const stocks = await StockReturn.find();
    return res.status(200).json(stocks);
  } catch (error) {
    next(error);
  }
};

export const deleteReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await StockReturn.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStock = await StockReturn.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json(updatedStock);
  } catch (error) {
    next(error);
  }
};
