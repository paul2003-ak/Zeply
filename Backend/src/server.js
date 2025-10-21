import express from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";

const app = express();


app.listen(ENV.PORT,()=>{
    connectDb();
    console.log("running on ..." , ENV.PORT);
})