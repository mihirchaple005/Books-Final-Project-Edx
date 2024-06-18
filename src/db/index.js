import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "../constants.js";

const app = express();

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error) => {
            console.log("Error while connecting to Database");
    
        })
    
        console.log(`MongoDB connect !! Mongo Host :  ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Unable to connect to database : ERROR => ", error);
        process.exit(1);
    }
}

export default connectDB