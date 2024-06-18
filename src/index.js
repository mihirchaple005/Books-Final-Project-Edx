import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path : './.env'
})

connectDB()
.then( () => {
    app.listen(process.env.PORT,() => {
        console.log(`App listening on the PORT : ${process.env.PORT}`)
    })
    app.on("error",(err) => {  // errror -> error me change kiya hai
        console.log("Error after connection : ",err);
    })
})
.catch((err) => {
    console.log("Error while connecting to DB : ERR -> ",err)
})
