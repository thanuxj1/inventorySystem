import express from 'express';
import {
  addClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
} from '../controllers/client.controller.js';

const router = express.Router();

router.post('/add', addClient);          // Add a new client
router.get('/', getAllClients);           // Get all clients
router.get('/:id', getClientById);        // Get client by ID
router.put('/:id', updateClientById);     // Update client by ID
router.delete('/:id', deleteClientById);  // Delete client by ID

export default router;
