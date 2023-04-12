import express from "express";
import {
  addProductImage,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAdminProduct,
  getAllProduct,
  getProductDetails,
  updateProduct,
} from "../controllers/product.js";

import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Auth Routes
router.route("/all").get(getAllProduct);
router.get("/admin", isAuthenticated, isAdmin, getAdminProduct);

router
  .route("/single/:id")
  .get(getProductDetails)
  .put(isAuthenticated, isAdmin, updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);

router
  .route("/new")
  .post(isAuthenticated, isAdmin, singleUpload, createProduct);

router
  .route("/images/:id")
  .post(isAuthenticated, isAdmin, singleUpload, addProductImage)
  .delete(isAuthenticated, isAdmin, deleteProductImage);

export default router;
