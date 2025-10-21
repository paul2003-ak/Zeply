import express from "express";
import cors from "cors";
import {clerkMiddleware} from "@clerk/express";

import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import userrouter from "./routes/user.route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/users",userrouter)

app.listen(ENV.PORT,()=>{
    connectDb();
    console.log("running on ..." , ENV.PORT);
})