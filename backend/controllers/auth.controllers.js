import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body

    // ✅ Check all fields first (prevents undefined errors)
    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" })
    }

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "user already exist" })
    }

    // ✅ Safe validation
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "password must be atleast 6 characters" })
    }

    if (!mobile || mobile.length < 10) {
      return res.status(400).json({ message: "mobile number should atleast 10 digit" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user = await User.create({
      fullName,   // ✅ fixed
      email,
      role,
      mobile,
      password: hashedPassword
    })

    const token = await genToken(user._id)

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    })

    return res.status(201).json(user)

  } catch (error) {
    // ✅ better error handling
    return res.status(500).json({ message: error.message })
  }
}


export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "user does not exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" }) // ✅ fixed typo
    }

    const token = await genToken(user._id)

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    })

    return res.status(200).json(user)

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}


export const signOut = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({ message: "log out successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const sendOtp= async(req,res)=>{
  try {
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"user does not exist"})
    }
    const otp=Math.floor(1000+Math.random()*9000).toString()
    user.resetOtp=otp
    user.otpExpires=Date.now()+5*60*1000
    user.isOtpVerified=false
    await user.save()
    await sendOtpMail(email,otp)
    return res.status(200).json({message:"otp sent successfully"})
  } catch (error) {
    return res.status(500).json(`send otp error ${error}`)
  }
}

export const verifyOtp= async(req,res)=>{
  try {
    const{email,otp}=req.body
    const user= await User.findOne({email})
    if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()){
      return res.status(400).json({message:"invalid/Expired otp"})
    }
    user.isOtpVerified=true
    user.resetOtp=undefined
    user.otpExpires=undefined
    await user.save()
    return res.status(200).json({message:"otp verify successfully"})
  } catch (error) {
    return res.status(500).json(`otp verify error ${error}`)
  }
}

export const resetPassword=async(req,res)=>{
  try {
    const {email,newPassword} = req.body
     const user=await User.findOne({email})
    if(!user || !user.isOtpVerified){
      return res.status(400).json({message:"otp verification required"})
    }
    const hashedPassword=await bcrypt.hash(newPassword,10)
    user.password=hashedPassword
    user.isOtpVerified=false;
    await user.save()
   return res.status(200).json({message: "password reset successfully"})
  } catch (error) {
    return res.status(400).json(`reset password error ${error}`)
  }
}

import admin from "../config/firebaseAdmin.js"; // 🔥 add this

export const googleAuth = async (req, res) => {
  try {
    const { token, mobile, role } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    // 🔥 verify firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    const email = decoded.email;
    const fullName = decoded.name || "Google User";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName,
        email,
        mobile,
        role,
        password: "GOOGLE_AUTH", // ✅ FIX (schema requires password)
      });
    }

    const jwtToken = await genToken(user._id);

    res.cookie("token", jwtToken, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(user);

  } catch (error) {
    console.log("GOOGLE AUTH ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};