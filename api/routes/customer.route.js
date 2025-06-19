import express from 'express';
import { 
  addCustomer, 
  checkDuplicate, 
  getAllCustomers, 
  getCustomerById, 
  updateCustomerById, 
  deleteCustomerById,
  getCustomersByCriteria 
} from '../controllers/customer.controller.js';

const router = express.Router();

// Add a new customer
router.post('/add', addCustomer);

// Check for duplicate customer by email
router.post('/check-duplicate', checkDuplicate);

// Get all customers or filter by criteria
router.get('/', (req, res) => {
  const { criteria } = req.query;
  if (criteria) {
    getCustomersByCriteria(req, res);
  } else {
    getAllCustomers(req, res);
  }
});

// Get a single customer by ID
router.get('/:id', getCustomerById);

// Update a customer by ID
router.put('/:id', updateCustomerById);

// Delete a customer by ID
router.delete('/:id', deleteCustomerById);

export default router;
