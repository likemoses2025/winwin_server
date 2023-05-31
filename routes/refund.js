import express from "express";
import {
  createRefund,
  deleteMyRefund,
  getMyRefund,
  getTeamRefund,
  updateMyRefund,
} from "../controllers/refund.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, createRefund);
router
  .get("/my", isAuthenticated, getMyRefund)
  .get("/team", isAuthenticated, getTeamRefund);

router.delete("/delete/:id", isAuthenticated, deleteMyRefund);
router.put("/update/:id", isAuthenticated, updateMyRefund);

export default router;
