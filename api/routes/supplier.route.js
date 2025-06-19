import express from "express";
import {
  addSupplier,
  getAllSupplier,
  deleteSupplier,
  updateSupplier,
  addSupplierStock,
  getSupplierIds,
  viewAllSupplierStock,
  editSupplierStock,
  deleteSupplierStock,
} from "../controllers/supplier.controller.js";

const router = express.Router();

//supplier add,read,update,delete routes
router.post("/addSupp", addSupplier); //add supplier
router.get("/getAllSupp", getAllSupplier); //read all suppliers
router.get("/ids", getSupplierIds); //read supplier ids
router.delete("/deleteSupp/:id", deleteSupplier); //delete supplier
router.put("/updateSupp/:id", updateSupplier); //update supplier

//supplier's stock add,read,update,delete routes
router.post("/addSuppStock", addSupplierStock); //add supplier's stock
router.get("/viewAllSuppStock", viewAllSupplierStock); //read all supplier's stock
router.put("/editSuppStock/:id", editSupplierStock); //edit supplier's stock
router.delete("/deleteSuppStock/:id", deleteSupplierStock); //delete supplier's stock

export default router;
