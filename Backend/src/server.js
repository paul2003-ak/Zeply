import express from "express";
import cors from "cors";
import {clerkMiddleware} from "@clerk/express";

import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import userrouter from "./routes/user.route.js";
import Postrouter from "./routes/post.route.js";
import commentsrouter from './routes/comment.route.js'
import notificationrouter from './routes/notification.route.js'
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";


const app = express();
app.use(cors());
app.use(express.json());


app.use(clerkMiddleware());
app.use(arcjetMiddleware);

// Routes
app.use("/api/users",userrouter)
app.use("/api/post",Postrouter)
app.use("/api/comments",commentsrouter)
app.use("/api/notification",notificationrouter)



//error handling middleware
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).json({message:"Something went wrong", error: err.message});
})

app.listen(ENV.PORT,()=>{
    connectDb();
    console.log("running on ..." , ENV.PORT);
})