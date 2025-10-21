import postmodel from '../models/post.model.js';
import usermodel from '../models/user.model.js';
import commentmodel from '../models/comment.model.js';
import { getAuth } from "@clerk/express";
import cloudinary from '../config/cloudinary.js';

//for show the all posts with user profile and everything and how comments with user profile
export const getposts = async (req, res) => {
    try {
        const posts = await postmodel.find()
            .sort({ createdAt: -1 })
            .populate("user", "username firstName lastName profilePicture")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username firstName lastName profilePicture"
                }
            })

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "getposts Error into the post controller", error: error.message });
    }
}


export const getpost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await postmodel.findById(postId)
            .populate("user", "username firstName lastName profilePicture")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username firstName lastName profilePicture"
                }
            })

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ message: "getpost Error", error: error.message });

    }
}

export const getuserposts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await usermodel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await postmodel.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate("user", "username firstName lastName profilePicture")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username firstName lastName profilePicture"
                }
            })

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "getuserposts Error", error: error.message });
    }
}


export const createPost = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { content } = req.body;
        const imagefile = req.file;

        if (!content && !imagefile) {
            return res.status(400).json({ message: "Post content or image is required" });
        }

        const user = await usermodel.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let imageurl = "";
        //upload image to cloudinary
        if (imagefile) {
            try {
                //convert buffer to base64 for clodinary
                const base64Image = `data:${imagefile.mimetype};base64,${imagefile.buffer.toString('base64')}`;

                const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                    folder: "social_media_posts",
                    resource_type: "image",
                    transformation: [
                        { width: 800, height: 800, crop: "limit" },
                        { quality: "auto" },
                        { format: "auto" }
                    ]
                });
                imageurl = uploadResponse.secure_url;
            } catch (uploaderror) {
                return res.status(500).json({ message: "Image upload failed", error: uploaderror.message });
            }
        }

        const newPost = await postmodel.create({
            user: user._id,
            content:content || "",
            image: imageurl
        });
        res.status(201).json({post: newPost});
    } catch (error) {
        res.status(500).json({ message: "createPost Error", error: error.message });

    }
}


export const likepost = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { postId } = req.params;

        const user = await usermodel.findOne({ clerkId: userId });
        const post= await postmodel.findById(postId);

        if (!user || !post) {
            return res.status(404).json({ message: "User pr Post not found" });
        }
        const isLiked = post.likes.includes(user._id);
        if (isLiked) {
            //unlike
            await postmodel.findByIdAndUpdate(post._id, {
                $pull: { likes: user._id }
            });
        } else {
            //like
            await postmodel.findByIdAndUpdate(post._id, {
                $push: { likes: user._id }
            });

            //create notification
            //if i like my own post then no notification
            if(post.user.toString() !== user._id.toString()){
                await notificationmodel.create({
                    from: user._id,
                    to: post.user,
                    type: "like",
                    post: post._id
                });
            }
        }
        res.status(200).json({ message: isLiked ? "Post unliked" : "Post liked" });
    } catch (error) {
        res.status(500).json({ message: "likepost Error", error: error.message });
    }
}

export const deletepost = async (req, res) => {
    try {
        const {userId} = getAuth(req);
        const {postId} = req.params;
        const user = await usermodel.findOne({clerkId: userId});
        const post = await postmodel.findById(postId);
        if(!user || !post){
            return res.status(404).json({message: "User or Post not found"});
        }
        if(post.user.toString() !== user._id.toString()){
            return res.status(403).json({message: "You are not authorized to delete this post"});
        }
        //delete all comements related to this post
        await commentmodel.deleteMany({post: post._id});

        await postmodel.findByIdAndDelete(post._id);
        res.status(200).json({message: "Post deleted successfully"});

    } catch (error) {
        res.status(500).json({message: "deletepost Error", error: error.message});
    }
}