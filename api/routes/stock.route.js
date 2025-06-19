import express from "express";
import {
  addStock,
  getAllStocks,
  deleteStock,
  updateStock,
  addReturnItems,
  viewReturnItems,
  deleteReturn,
  updateReturn,
} from "../controllers/stock.controller.js";

const router = express.Router();

//stock add,read,update,delete routes
router.post("/addStock", addStock); //add stock
router.get("/getAll", getAllStocks); //read all stocks
router.delete("/deleteStock/:id", deleteStock); //delete stock
router.put("/updateStock/:id", updateStock); //update stock

//return items add,read,update,delete routes
router.post("/addReturn", addReturnItems); //add return items
router.get("/viewReturn", viewReturnItems); //read all reurn items
router.delete("/deleteReturn/:id", deleteReturn); //delete return item
router.put("/updateReturn/:id", updateReturn); //update return item

export default router;
