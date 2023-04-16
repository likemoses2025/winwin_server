import express from "express";
import {
  createOrder,
  deleteMyOrder,
  getMyOrder,
  getTeamOrder,
} from "../controllers/order.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createOrder);
router
  .get("/myOrder", isAuthenticated, getMyOrder)
  .get("/teamOrder", isAuthenticated, getTeamOrder);

router.delete("/deleteMyOrder", isAuthenticated, deleteMyOrder);

export default router;
