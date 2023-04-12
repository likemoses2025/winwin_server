import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
} from "../controllers/category.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, isAdmin, addCategory);
router.get("/all", getAllCategories);
router.get("/single/:id", getCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;
