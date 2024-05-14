import {User} from "../models/userschema.js";
import { catchasyncerror } from "../../middlewares/catchasyncerror.js";
import Errorhandler from "../../middlewares/error.js";
import { sendtoken } from "../../utils/jwt.js";

export const register=catchasyncerror(async(req, res, next)=>{
    const {name, email, password, phone}=req.body;
    if(!name || !email || !password || !phone){
        return next(new Errorhandler("Please provide complete details."))
    }

    const isEmail=await User.findOne({email});
    if(isEmail){
        return next(new Errorhandler("Email already exists."));
    }

    const user=await User.create({
        name, 
        email, 
        phone, 
        password
    });

    sendtoken(user, 200, res, "user registered successfully.")
})

export const login=catchasyncerror(async(req, res, next)=>{
    const {email, password}=req.body;
    if(!email || !password){
        return next(new Errorhandler("Please provide the details", 400));
    }

    const user=await User.findOne({email}).select("+password")
    if(!user){
        return next(new Errorhandler("invalid", 400))
    }

const passwordmatched=await User.comparepassword(password)
if(!passwordmatched){
    return next(new Errorhandler("invalid", 400));
}

sendtoken(user, 200, res, "user registered successfully.")
});

export const logout=catchasyncerror(async(req, res, next)=>{
    res
    .status(201).cookie("token", "", {
        httpOnly:true,
        expires:new Date(Date.now()),
        secure:true,
        sameSite:"None"
    })
    .json({
        success:true,
        message:"user logged out successfully."
    })
})