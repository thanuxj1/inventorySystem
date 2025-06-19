// controllers/purchaseController.js
import Purchase from '../models/Purchase.model.js';

// Create a new purchase
export const createPurchase = async (req, res) => {
  const { stockId, quantity } = req.body;

  try {
    const newPurchase = new Purchase({
      stockId,
      quantity,
      status: 'Pending', // Default status
    });

    await newPurchase.save();
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ message: 'Failed to create purchase' });
  }
};

// Get all purchases
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate('stockId'); // Populating stock details
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error retrieving purchases:', error);
    res.status(500).json({ message: 'Failed to retrieve purchases' });
  }
};

// Update a purchase status
export const updatePurchaseStatus = async (req, res) => {
    const { purchaseId } = req.body; // Get purchaseId from the request body
  
    try {
      // Update status to "Completed"
      const purchase = await Purchase.findByIdAndUpdate(
        purchaseId,
        { status: 'Completed' }, // Set status to "Completed"
        { new: true } // Return the updated document
      );
  
      if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
      }
  
      res.status(200).json(purchase); // Return the updated purchase
    } catch (error) {
      console.error('Error updating purchase status:', error);
      res.status(500).json({ message: 'Failed to update purchase status' });
    }
  };
  