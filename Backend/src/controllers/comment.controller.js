import commentmodel from "../models/comment.model.js";
import postmodel from "../models/post.model.js"
import usermodel from '../models/user.model.js';
import notificationmodel from '../models/notification.model.js'
import { getAuth } from "@clerk/express";


export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await commentmodel.find({ post: postId })
            .sort({ createdAt: -1 })
            .populate("user", "username firstName lastName profilePicture")

        res.status(200).json({ comments })

    } catch (error) {
        res.status(500).json({ message: "Failed to get comments", error: error.message })
    }
}


export const createComment = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { postId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Comment content cannot be empty" })

        }

        const user = await usermodel.findOne({ clerkId: userId });
        const post = await postmodel.findById(postId);

        if (!post || !user) {
            return res.status(404).json({ message: "Post or user not found" })
        }

        const newComment = await commentmodel.create({
            content,
            user: user._id,
            post: post._id
        });

        //link the comment to the post
        await postmodel.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id }
        })

        //craete notification if not commenting on own post
        if(post.user.toString() !== user._id.toString()){
            await notificationmodel.create({
                type: "comment",
                sender: user._id,
                receiver: post.user,
                post: post._id,
                comment: newComment._id
            })
        }

        res.status(201).json({ message: "Comment created successfully", comment: newComment });

    } catch (error) {
        res.status(500).json({ message: "Failed to create comment", error: error.message })

    }
}

export  const deleteComment=async(req,res)=>{
    try {
        const {userId}=getAuth(req);
        const {commentId}=req.params;

        const user=await usermodel.findOne({clerkId:userId});
        const comment=await commentmodel.findById(commentId);

        if(!comment || !user){
            return res.status(404).json({message:"Comment or user not found"})
        }

        if(comment.user.toString()!==user._id.toString()){
            return res.status(403).json({message:"You are not authorized to delete this comment"})
        }

        //remove the comments from the post
        await postmodel.findByIdAndUpdate(comment.post,{
            $pull:{comments:comment._id}
        })

        //delete the comment
        await commentmodel.findByIdAndDelete(commentId);

        res.status(200).json({message:"Comment deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"Failed to delete comment", error:error.message})
    }
}