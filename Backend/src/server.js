import express from "express";
import cors from "cors";
import {clerkMiddleware} from "@clerk/express";

import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import userrouter from "./routes/user.route.js";
import Postrouter from "./routes/post.route.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/users",userrouter)
app.use("/api/post",Postrouter)

//error handling middleware
app.use((err,req,res)=>{
    console.log(err);
    res.status(500).json({message:"Something went wrong", error: err.message});
})

app.listen(ENV.PORT,()=>{
    connectDb();
    console.log("running on ..." , ENV.PORT);
})