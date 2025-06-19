// routes/purchases.js
import express from 'express';
import * as purchaseController from '../controllers/purchase.controller.js';

const router = express.Router();

// Create a new purchase
router.post('/create', purchaseController.createPurchase);

// Get all purchases
router.get('/', purchaseController.getAllPurchases);

// Update a purchase status (optional)
router.put('/', purchaseController.updatePurchaseStatus); // This route will handle the update

export default router;
