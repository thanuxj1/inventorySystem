import Employee from "../models/employee.model.js";
import Jwt from "jsonwebtoken";
  
  export const addEmployee = async (req, res, next) => {

    const { name, email } = req.body;

    
    const password = name + Math.floor(1000 + Math.random() * 9000).toString();

    const newEmployee = new Employee({ name, email, password });
    
    try {
        await newEmployee.save();
        res.status(201).json('Employee added');
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {

  const { email, password } = req.body;
  try {
      const validemployee = await Employee.findOne({email});
      if(!validemployee) return next(errorHandler(404, 'User not found'));
      if(password !== validemployee.password) return next(errorHandler('401', 'Wrong Credentials!'));
      const token = Jwt.sign({id: validemployee._id}, process.env.JWT_SECRET);
      const { password: pass, ...rest } = validemployee._doc;
      res
          .cookie('access_token', token, {httpOnly: true})
          .status(200) 
          .json(rest);
  } catch (error) {
      next(error);
  }
};

// Get all employees
export const getAllEmployees = async (req, res, next) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  };

// Fetch a specific employee's details by ID
export const getEmployeeById = async (req, res, next) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return next(errorHandler(404, "Employee not found"));
      res.status(200).json(employee);
    } catch (err) {
      next(err);
    }
  };

// Update an employee's details
export const updateEmployee = async (req, res, next) => {
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedEmployee);
    } catch (err) {
      next(err);
    }
  };


  // Delete an employee by ID
export const deleteEmployee = async (req, res) => {
    const { id } = req.params; // Get the employee ID from the request parameters
  
    try {
      // Find the employee by ID and delete
      const deletedEmployee = await Employee.findByIdAndDelete(id);
  
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully', deletedEmployee });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Server error. Unable to delete employee' });
    }
  };


  export const signOut = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
};