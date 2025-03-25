import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS, // App Password (not normal Gmail password)
  },
});

// Send OTP Mail
export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"QuickBite Support" <${process.env.EMAIL}>`,
      to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial; padding: 10px;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#ff4d2d">${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log(" OTP Email Sent");
  } catch (error) {
    console.error(" Error sending email:", error.message);
  }
};