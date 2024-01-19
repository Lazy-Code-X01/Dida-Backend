import express from "express";
import {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	createEvent,
	getUserEvents,
	getAllEvents,
} from "../controllers/userControllers.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.post("/events", protect, createEvent);
router.get("/events", getAllEvents);
router.get("/events/:userId", protect, getUserEvents);
router
	.route("/profile")
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);

export default router;
