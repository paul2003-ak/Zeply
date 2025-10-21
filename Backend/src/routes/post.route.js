import express from "express";
import { getpost, getposts, getuserposts,createPost, likepost, deletepost } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
const router= express.Router();

router.get("/",getposts);
router.get("/:postId",getpost);//for a single post
router.get("/user/:username",getuserposts); //whos posts i want to see

//protected routes
router.post("/create",protectRoute,upload.single("image"), createPost);
router.post("/:postId/like",protectRoute, likepost);
router.delete("/:postId",protectRoute, deletepost);


export default router;