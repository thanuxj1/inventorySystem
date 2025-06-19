import Leave from '../models/leave.model.js';
import Employee from '../models/employee.model.js';

// Add a new leave request
export const addLeave = async (req, res, next) => {
  const { employeeId, leaveType, startDate, endDate, reason } = req.body;

  try {
    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ msg: 'Employee not found' });

    // Create new leave request
    const newLeave = new Leave({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason
    });

    // Save leave request to the database
    await newLeave.save();
    res.status(201).json(newLeave);
  } catch (error) {
    next(error);
  }
};


// Fetch all leave records for a specific employee
export const getLeavesByEmployeeId = async (req, res, next) => {
    try {
      const leaves = await Leave.find({ employeeId: req.params.employeeId });
      res.status(200).json(leaves);
    } catch (err) {
      next(err);
    }
  };

// Delete a specific leave record by leave ID
export const deleteLeave = async (req, res) => {
    try {
      const leaveId = req.params.leaveId;
      await Leave.findByIdAndDelete(leaveId);
      res.json({ message: 'Leave record deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting leave record', error: err });
    }
  };

// Get leave details by leaveId
export const getLeaveById = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ msg: 'Leave not found' });
    res.json(leave);
  } catch (err) {
    next(err); // Pass the error to the global error handler
  }
};



// Update leave details by leaveId
export const updateLeaveById = async (req, res) => {
  try {
    const leaveId = req.params.leaveId;
    const { leaveType, startDate, endDate, reason } = req.body;

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        leaveType,
        startDate,
        endDate,
        reason,
      },
      { new: true } // Return the updated leave details
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.json(updatedLeave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};