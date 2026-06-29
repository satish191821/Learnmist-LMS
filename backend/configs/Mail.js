import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, otp, subject = "Reset Your Password") => {
    let appName = "LearnMist"
    let year = new Date().getFullYear()
    await transporter.sendMail({
        from: `"${appName}" <${process.env.EMAIL}>`,
        to: to,
        subject: subject,
        html: `
<div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
  <div style="background: #1e293b; padding: 24px 32px; text-align: center;">
    <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">${appName}</h1>
  </div>
  <div style="padding: 32px;">
    <h2 style="color: #1e293b; font-size: 18px; margin: 0 0 8px;">Email Verification</h2>
    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
      Use the OTP below to verify your email address. This code expires in <strong>5 minutes</strong>.
    </p>
    <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
      <span style="font-size: 36px; letter-spacing: 12px; font-weight: 700; color: #1e293b;">${otp}</span>
    </div>
    <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
  <div style="background: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #94a3b8; font-size: 11px; margin: 0;">&copy; ${year} ${appName}. All rights reserved.</p>
  </div>
</div>`
    });
};

export default sendMail
