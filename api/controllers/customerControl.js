const Customer = require('../Model/CustomerModel');

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new customer
const addCustomer = async (req, res) => {
    const newCustomer = new Customer(req.body);
    try {
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a customer by ID
const updateCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a customer by ID
const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        await Customer.findByIdAndDelete(id);
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllCustomers, addCustomer, updateCustomer, deleteCustomer };
