import Customer from '../models/customer.model.js';

// Add a customer
export const addCustomer = async (req, res, next) => {
  const { firstName, lastName, phoneNumber, email, address, category} = req.body;

  try {
    console.log('Incoming customer data:', req.body);

    // Validate the required fields
    if (!firstName || !lastName || !phoneNumber || !email || !address ||!category) {
      console.error('Validation error: All fields are required');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new customer
    const newCustomer = new Customer({
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      category,
    });

    // Save the customer to the database
    await newCustomer.save();

    // Return the newly added customer
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error while adding customer:', error);
    next(error); // Pass any errors to the error-handling middleware
  }
};

// Function to check for duplicate customers by email
export const checkDuplicate = async (req, res) => {
  const { email } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    return res.status(200).json({ exists: !!existingCustomer });
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    return res.status(500).json({ message: 'Error checking for duplicates', error });
  }
};

// Get all customers
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

// Get a single customer by ID
export const getCustomerById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

// Update a customer by ID
export const updateCustomerById = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, category } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phoneNumber, category },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

// Delete a customer by ID
export const deleteCustomerById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get customers by some criteria (if needed)
export const getCustomersByCriteria = async (req, res) => {
  const { criteria } = req.query;

  try {
    const customers = await Customer.find(criteria ? { category: criteria } : {});
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};
