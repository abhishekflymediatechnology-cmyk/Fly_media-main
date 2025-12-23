const otpmodel = require("../model/otpmodel");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')
const path = require('path')
const appmodel = require('../model/Model');
const { setExhibition } = require("../util/Service");
async function handleappsignup(req, res) {
  try {

    let { name, pass, email, mobile_number } = req.body;

    // ✅ 0. Input validation
    if (!name || !pass || !email || !mobile_number) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, pass, email, mobile_number) are required.",
      });
    }
    let dat2 = await otpmodel
    .find({ email, isapproved: true });
    console.log(dat2, 'data22')
    if (dat2.length === 0) {
      let finduser = await otpmodel.find({ email, isapproved: false });
      console.log(finduser);
      if (finduser.length === 0) {
        let otp = "";
        for (let i = 0; i < 6; i++) {
          otp = Math.floor(100000 + Math.random() * 900000);
        }
        otp = Number(otp); // ensure it's a number

        console.log("Generated OTP:", otp);

        // 2. Hash password before saving
        const hashedPass = await bcrypt.hash(pass, 10);

        // 3. Send Email via Gmail
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "appdeveloper1208@gmail.com",
            pass: "woin wube avhm rkxg", // Gmail App password (App-specific)
          },
        });

        await transporter.sendMail({
          from: '"Onexhib App" <appdeveloper1208@gmail.com>',
          to: email,
          subject: "Your OTP Code - Onexhib Verification",
          text: `Your OTP is: ${otp}`,
          html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
            <h2 style="text-align:center; color:#2563eb;">🔐 Onexhib Account Verification</h2>
            <p style="font-size: 15px; color:#333;">Hello,</p>
            <p style="font-size: 15px; color:#333;">
              Thank you for signing up with <b>Onexhib</b>. To complete your registration, please use the OTP code below:
            </p>
            <div style="text-align:center; margin: 20px 0;">
              <span style="display:inline-block; background:#2563eb; color:#fff; padding:10px 25px; border-radius:6px; font-size:22px; letter-spacing:2px; font-weight:bold;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color:#555;">
              ⚠️ This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.
            </p>
            <p style="font-size: 14px; color:#555;">If you didn’t request this verification, you can safely ignore this email.</p>
            <hr style="margin:25px 0; border:none; border-top:1px solid #ddd;">
            <p style="text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Onexhib  — All rights reserved.<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `,
        });

        console.log("Email sent successfully");

        // 4. Save user + OTP in DB
        let sign = await otpmodel.create({
          name,
          pass: hashedPass,
          email,
          mobile_number,
          otp,
        });
        const token = setExhibition(sign);
        res
          .cookie("uid", token)
          .status(201)
          .json({
            message: "New user created successfully",
            user: sign, // ✅ Return the created user for the frontend
          });
      } else {
        let dat = await otpmodel.deleteOne({ email, isapproved: false });
        console.log(dat, 'data')
        console.log(dat2, 'data2')
        let otp = "";
        for (let i = 0; i < 6; i++) {
          otp = Math.floor(100000 + Math.random() * 900000);
        }
        otp = Number(otp); // ensure it's a number

        console.log("Generated OTP:", otp);

        // 2. Hash password before saving
        const hashedPass = await bcrypt.hash(pass, 10);

        // 3. Send Email via Gmail
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "appdeveloper1208@gmail.com",
            pass: "woin wube avhm rkxg", // Gmail App password (App-specific)
          },
        });

        await transporter.sendMail({
          from: '"Onexhib App" <appdeveloper1208@gmail.com>',
          to: email,
          subject: "Your OTP Code - Onexhib Verification",
          text: `Your OTP is: ${otp}`,
          html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
            <h2 style="text-align:center; color:#2563eb;">🔐 Onexhib Account Verification</h2>
            <p style="font-size: 15px; color:#333;">Hello,</p>
            <p style="font-size: 15px; color:#333;">
              Thank you for signing up with <b>Onexhib</b>. To complete your registration, please use the OTP code below:
            </p>
            <div style="text-align:center; margin: 20px 0;">
              <span style="display:inline-block; background:#2563eb; color:#fff; padding:10px 25px; border-radius:6px; font-size:22px; letter-spacing:2px; font-weight:bold;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color:#555;">
              ⚠️ This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.
            </p>
            <p style="font-size: 14px; color:#555;">If you didn’t request this verification, you can safely ignore this email.</p>
            <hr style="margin:25px 0; border:none; border-top:1px solid #ddd;">
            <p style="text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Onexhib App — All rights reserved.<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `,
        });

        console.log("Email sent successfully");

        // 4. Save user + OTP in DB
        let sign = await otpmodel.create({
          name,
          pass: hashedPass,
          email,
          mobile_number,
          otp,
        });
        const token = setExhibition(sign);
        res
          .cookie("uid", token)
          .status(201)
          .json({
            message: "New user created successfully",
            user: sign, // ✅ Return the created user for the frontend
          });
      }
    }
    else {
      return res.send('allready user');

    }

  }
  // 1. Generate OTP (convert to number)

  catch (err) {
    console.error("Error in signup middleware:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "OTP sending failed" });
  }
}
async function handleapplogin(req, res) {
  try {
    const { email, pass } = req.body;
    console.log(email, pass);

    // 1️⃣ Find user by email only
    const user1 = await otpmodel.findOne({ email, isapproved: false });
    if (user1) {
      return res
        .status(404)
        .json({
          message: "User Not registered",
        });
    } else {

    }
    let user = await otpmodel.findOne({ email })
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // 2️⃣ Compare password hashes
    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    console.log(isMatch)
    // 3️⃣ Create and send token
    const token = setExhibition(user);
    console.log("User logged in:", user.email);

    res
      .cookie("uid", token, { httpOnly: true, secure: true })
      .status(200)
      .json({
        message: "Login successful",
        user, // You may want to exclude password before sending
      });

  } catch (err) {
    console.error("Login Error:", err);
    return handleServerError(res, err, "Login failed");
  }
}
async function handleappotp(req, res) {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find the OTP entry
    const record = await otpmodel.findOne({ otp });

    if (!record) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    // Update approval status
    const updateResult = await otpmodel.updateOne(
      { email: record.email, otp: otp },
      { $set: { isapproved: true } }
    );
    const finalresult = await otpmodel.findOne({ otp });
    // Send proper response
    if (updateResult.modifiedCount > 0) {
      return res.status(200).json({ message: "OTP verified successfully", finalresult });
    } else {
      return res.status(200).json({ message: "Already verified", finalresult });
    }

  } catch (error) {
    console.error("Error in handleOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function handleForgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await otpmodel.findOne({ email, isapproved: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send email
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "appdeveloper1208@gmail.com",
        pass: "woin wube avhm rkxg",
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Reset Password OTP",
      html: `<h3>Your OTP is ${otp}</h3><p>Valid for 5 minutes</p>`
    });

    res.status(200).json({
      message: "OTP sent to email"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}
async function verifyForgotOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await otpmodel.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
}
async function resetPassword(req, res) {
  try {
    const { email, newPass } = req.body;

    const user = await otpmodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPass = await bcrypt.hash(newPass, 10);

    user.pass = hashedPass;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Password reset failed" });
  }
}

module.exports={
    handleapplogin,
    handleappotp,
    handleappsignup,
    handleForgotPassword
    ,verifyForgotOtp,
    resetPassword
}