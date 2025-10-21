import express from "express";
import { followuser, getcurrentUser, getUserProfile, syncUser, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router=express.Router();

router.get('/profile/:username',getUserProfile);

router.post('/sync',protectRoute,syncUser);
router.post('/me',protectRoute,getcurrentUser);
router.put("/profile",protectRoute,updateProfile);
router.post("/follow/:targetuserId",protectRoute,followuser);

export default router;