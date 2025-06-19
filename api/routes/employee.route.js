import express from 'express';
import { addEmployee, signin, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, signOut } from '../controllers/employee.controller.js';

const router = express.Router();

router.post('/addEmployee', addEmployee);
router.post('/signin', signin);

// Get all employees
router.get('/', getAllEmployees);

// Get employee by ID
router.get("/:id", getEmployeeById);

// Update employee by ID
router.put("/:id", updateEmployee);

router.delete('/delete/:id', deleteEmployee);

router.post('/signout', signOut);



export default router;