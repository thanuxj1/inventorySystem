import express from 'express';
import {
  addLeave,
  getLeavesByEmployeeId,
  deleteLeave,
  getLeaveById,
  updateLeaveById
} from '../controllers/leave.controller.js';

const router = express.Router();

// Add a new leave request
router.post('/add', addLeave);

// Get leave details by leaveId
router.get('/leaveBy/:id', getLeaveById);

// Get all leaves for a specific employee by employeeId
router.get("/:employeeId", getLeavesByEmployeeId);

// Update leave details by leaveId
router.put('/:leaveId', updateLeaveById);

// Route to delete a leave record
router.delete('/:leaveId', deleteLeave);



export default router;
