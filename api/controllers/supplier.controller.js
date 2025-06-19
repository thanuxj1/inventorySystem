import Supplier from "../models/supplier.model.js";
import SuppStock from "../models/supplier.stock.js";
import nodemailer from 'nodemailer'; // Import nodemailer for sending emails

//controller of add,read,update,delete, and get ids of supllier
export const addSupplier = async (req, res, next) => {
  try {
    const addSup = await Supplier.create(req.body);
    return res.status(201).json(addSup);
  } catch (error) {
    next(error);
  }
};

export const getAllSupplier = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find(); // Retrieve all stocks from the database
    return res.status(200).json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json(updatedSupplier);
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Supplier.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getSupplierIds = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    const ids = suppliers.map((supplier) => supplier.id);
    return res.status(200).json({ ids });
  } catch (error) {
    next(error);
  }
};


// Set up the email transport service using nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use a different service like 'SendGrid', 'SMTP', etc.
  auth: {
    user: 'wup0327@gmail.com', // your email address
    pass: 'gopwqpqididmzhwq' // your email password or app-specific password
  }
});

export const addSupplierStock = async (req, res, next) => {
  try {
    // Create the stock entry
    const addSup = await SuppStock.create(req.body);

    // Retrieve the supplier email using the Supplier ID from the stock entry
    const supplier = await Supplier.findById(req.body.supplierId); // Use findById with ObjectId

    if (supplier) {
      const supplierEmail = supplier.email;

      // Send an email to the supplier
      const mailOptions = {
        from: 'wup0327@gmail.com', // Sender address
        to: supplierEmail, // List of recipients
        subject: 'Stock Added Notification', // Subject line
        text: `Dear Supplier,\n\nA new stock has been added for your products. Details:\n\nItem Name: ${req.body.itname}\nQuantity: ${req.body.quantity}\nDate: ${req.body.date}\n\nThank you!`, // Plain text body
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.error(`Supplier not found for ID: ${req.body.supplierId}`);
    }

    return res.status(201).json(addSup);
  } catch (error) {
    next(error);
  }
};



export const viewAllSupplierStock = async (req, res, next) => {
  try {
    // Retrieve all stocks and populate the supplierId field with supplier details
    const suppliers = await SuppStock.find().populate('supplierId', 'id'); // Include fields as needed
    return res.status(200).json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const editSupplierStock = async (req, res, next) => {
  const { id } = req.params;
  const { id: stockId, itname, quantity, date } = req.body;

  try {
    const updatedStock = await SuppStock.findByIdAndUpdate(
      id,
      { id: stockId, itname, quantity, date },
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.status(200).json(updatedStock);
  } catch (error) {
    next(error);
  }
};

export const deleteSupplierStock = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await SuppStock.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    next(error);
  }
};
