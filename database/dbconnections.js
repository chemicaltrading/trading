import mongoose from "mongoose";

export const dbconnections=()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbname:"Chemical_Trading"
    }).then(()=>{
        console.log("Connected to database");
    }).catch((error)=>{
        console.log(`some error occurred ${error}`)
    })
}