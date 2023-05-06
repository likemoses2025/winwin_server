import express from "express";
import {
  changePassword,
  forgetPassword,
  getMyProfile,
  logOut,
  login,
  resetPassword,
  signup,
  updatePic,
  updateProfile,
  addPlace,
  deletePlace,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Auth Routes
router.post("/login", login);

router.post("/new", singleUpload, signup);

router.get("/me", isAuthenticated, getMyProfile);

// Profile Route
router.get("/logout", isAuthenticated, logOut);

// Update Routes
router.put("/updateprofile", isAuthenticated, updateProfile);
router.put("/changepassword", isAuthenticated, changePassword);
router.put("/updatepic", isAuthenticated, singleUpload, updatePic);

// Delivery Place
router.put("/addPlace", isAuthenticated, addPlace);
router.delete("/deletePlace/:id", isAuthenticated, deletePlace);

// Forget Password & Reset Password
router.route("/forgetpassword").post(forgetPassword).put(resetPassword);

export default router;
