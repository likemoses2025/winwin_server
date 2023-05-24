import express from "express";
import {
  createOrder,
  deleteMyOrder,
  getTeamOrder,
  getDealerOrder,
  updateMyOrder,
} from "../controllers/order.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createOrder);
router
  .get("/dealer", isAuthenticated, getDealerOrder)
  .get("/manager", isAuthenticated, getTeamOrder);

router.delete("/deleteMyOrder", isAuthenticated, deleteMyOrder);
router.put("/updateOrder/:id", isAuthenticated, updateMyOrder);

export default router;
