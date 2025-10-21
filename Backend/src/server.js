import express from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";

const app = express();
connectDb();

app.listen(ENV.PORT,()=>{
    console.log("running on ..." , ENV.PORT);
})