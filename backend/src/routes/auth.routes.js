import express from "express";
import { login, signup, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", protect, logout);
router.put("/update-profile", protect, updateProfile);
router.get("/check", protect, checkAuth);

export default router;
