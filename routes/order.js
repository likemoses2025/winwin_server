import express from "express";
import {
  createOrder,
  deleteMyOrder,
  getMyOrders,
  getTeamOrder,
  updateMyOrder,
} from "../controllers/order.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createOrder);
router
  .get("/my", isAuthenticated, getMyOrders)
  .get("/team", isAuthenticated, getTeamOrder);

router.delete("/delete/:id", isAuthenticated, deleteMyOrder);
router.put("/update/:id", isAuthenticated, updateMyOrder);

export default router;
