import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "Please enter a valid email address."]
    },

    phone:{
        type:Number,
        required:true
    },

    password:{
        type:String,
        required:true,
        minLength:[8, "Password must be of atleat 8 characters."]
    },

})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparepassword=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword, this.password);
}

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn:process.env.JWT_EXPIRE
    })
}

export const User=mongoose.model("User", userSchema)