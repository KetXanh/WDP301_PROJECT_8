const Otp = require('../../models/otp');
const Users = require('../../models/user');
const { hashPassword } = require('../../utils/bcryptHelper');
const generalOtp = require('../../utils/generateOtp')
module.exports.register = async (req, res) => {
    try {
        req.body.password = await hashPassword(req.body.password);
        const emailExit = await Users.findOne({
            $or: [{ email }, { username }]
        })
        if (emailExit) {
            return res.status(401).json({
                message: emailExit.email === req.body.email
                    ? "Email already exits"
                    : "Username already exits"
            })
        }
        const user = new Users(req.body);
        user.save();
        res.status(201).json({
            message: "Register successfully"
        })
        const otp = generalOtp.generateOtp(6);
        const objVrtify = {
            email: email,
            purpose: "verify-email",
            otp: otp,
            "expireAt": Date.now()
        }
        const vertifyEmail = new Otp(objVrtify);
        await vertifyEmail.save();

        const subject = "Your One-Time Password (OTP) for Account Verification";
        const html = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        line-height: 1.6;
                                        color: #333;
                                        background-color: #f9f9f9;
                                        padding: 20px;
                                    }
                                    .email-container {
                                        max-width: 600px;
                                        margin: 0 auto;
                                        background: #ffffff;
                                        border: 1px solid #ddd;
                                        border-radius: 8px;
                                        overflow: hidden;
                                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                    }
                                    .email-header {
                                        background: #4caf50;
                                        color: #ffffff;
                                        text-align: center;
                                        padding: 20px;
                                        font-size: 24px;
                                    }
                                    .email-body {
                                        padding: 20px;
                                        text-align: left;
                                    }
                                    .email-body h3 {
                                        color: #4caf50;
                                    }
                                    .email-footer {
                                        text-align: center;
                                        padding: 10px;
                                        background: #f1f1f1;
                                        color: #555;
                                        font-size: 12px;
                                    }
                                    .otp {
                                        font-size: 24px;
                                        font-weight: bold;
                                        color: #333;
                                        background: #f4f4f4;
                                        padding: 10px;
                                        border-radius: 8px;
                                        display: inline-block;
                                        margin: 10px 0;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="email-container">
                                    <div class="email-header">
                                        Account Verification
                                    </div>
                                    <div class="email-body">
                                        <p>Dear User,</p>
                                        <p>To complete the verification process for your account, please use the following One-Time Password (OTP):</p>
                                        <h3 class="otp">${otp}</h3>
                                        <p>This OTP is valid for the next <strong>3 minutes</strong>. For your security, please do not share this OTP with anyone.</p>
                                        <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
                                        <p>Thank you,<br>The Nutigo Team</p>
                                    </div>
                                    <div class="email-footer">
                                        © 2025 Nutigo. All rights reserved.
                                    </div>
                                </div>
                            </body>
                            </html>
                            `;
        sendEmail.sendEmail(email, subject, html)

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports.vertifyAccount = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const optCorrect = await Otp.findOne({
            otp: otp,
            purpose: "verify-email"
        })
        if (!optCorrect) {
            return res.status(400).json({ message: "OTP Not Correct" })
        }
        await Users.updateOne({
            email: email
        }, {
            status: "active"
        })
        res.status(200).json({
            message: "Vertify Successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const vertifyExits = await Otp.findOne({
            email: email
        })
        if (vertifyExits) {
            return res.code(401).json({
                message: "Account is Vertify"
            })
        }
        const otp = generalOtp.generateOtp(6);
        const objVrtify = {
            email: email,
            otp: otp,
            "expireAt": Date.now()
        }
        const vertifyEmail = new Otp(objVrtify);
        await vertifyEmail.save();
        const subject = "Your One-Time Password (OTP) for Account Verification";
        const html = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                    color: #333;
                                    background-color: #f9f9f9;
                                    padding: 20px;
                                }
                                .email-container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background: #ffffff;
                                    border: 1px solid #ddd;
                                    border-radius: 8px;
                                    overflow: hidden;
                                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                }
                                .email-header {
                                    background: #4caf50;
                                    color: #ffffff;
                                    text-align: center;
                                    padding: 20px;
                                    font-size: 24px;
                                }
                                .email-body {
                                    padding: 20px;
                                    text-align: left;
                                }
                                .email-body h3 {
                                    color: #4caf50;
                                }
                                .email-footer {
                                    text-align: center;
                                    padding: 10px;
                                    background: #f1f1f1;
                                    color: #555;
                                    font-size: 12px;
                                }
                                .otp {
                                    font-size: 24px;
                                    font-weight: bold;
                                    color: #333;
                                    background: #f4f4f4;
                                    padding: 10px;
                                    border-radius: 8px;
                                    display: inline-block;
                                    margin: 10px 0;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="email-header">
                                    Account Verification
                                </div>
                                <div class="email-body">
                                    <p>Dear User,</p>
                                    <p>To complete the verification process for your account, please use the following One-Time Password (OTP):</p>
                                    <h3 class="otp">${otp}</h3>
                                    <p>This OTP is valid for the next <strong>3 minutes</strong>. For your security, please do not share this OTP with anyone.</p>
                                    <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
                                    <p>Thank you,<br>The Nutigo Team</p>
                                </div>
                                <div class="email-footer">
                                    © 2025 Nutigo. All rights reserved.
                                </div>
                            </div>
                        </body>
                        </html>
                        `;
        sendEmail.sendEmail(email, subject, html)
        res.status(200).json({
            message: "Resend Otp Successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


module.exports.forgot = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({
            email: email,
            status: "active"
        })
        if (!user) {
            return res.status(401).json({
                message: "Email Not Exits"
            })
        }
        const otp = generalOtp.generateOtp(6);
        const objVrtify = {
            email: email,
            purpose: "forgot-password",
            otp: otp,
            "expireAt": Date.now()
        }
        const vertifyEmail = new Otp(objVrtify);
        await vertifyEmail.save();
        const subject = "Your One-Time Password (OTP) for Account Verification";
        const html = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        line-height: 1.6;
                                        color: #333;
                                        background-color: #f9f9f9;
                                        padding: 20px;
                                    }
                                    .email-container {
                                        max-width: 600px;
                                        margin: 0 auto;
                                        background: #ffffff;
                                        border: 1px solid #ddd;
                                        border-radius: 8px;
                                        overflow: hidden;
                                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                    }
                                    .email-header {
                                        background: #4caf50;
                                        color: #ffffff;
                                        text-align: center;
                                        padding: 20px;
                                        font-size: 24px;
                                    }
                                    .email-body {
                                        padding: 20px;
                                        text-align: left;
                                    }
                                    .email-body h3 {
                                        color: #4caf50;
                                    }
                                    .email-footer {
                                        text-align: center;
                                        padding: 10px;
                                        background: #f1f1f1;
                                        color: #555;
                                        font-size: 12px;
                                    }
                                    .otp {
                                        font-size: 24px;
                                        font-weight: bold;
                                        color: #333;
                                        background: #f4f4f4;
                                        padding: 10px;
                                        border-radius: 8px;
                                        display: inline-block;
                                        margin: 10px 0;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="email-container">
                                    <div class="email-header">
                                        Account Verification
                                    </div>
                                    <div class="email-body">
                                        <p>Dear User,</p>
                                        <p>To complete the verification process for your account, please use the following One-Time Password (OTP):</p>
                                        <h3 class="otp">${otp}</h3>
                                        <p>This OTP is valid for the next <strong>3 minutes</strong>. For your security, please do not share this OTP with anyone.</p>
                                        <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
                                        <p>Thank you,<br>The Nutigo Team</p>
                                    </div>
                                    <div class="email-footer">
                                        © 2025 Nutigo. All rights reserved.
                                    </div>
                                </div>
                            </body>
                            </html>
                    `;
        sendEmail.sendEmail(email, subject, html);
        res.status(200).json({ email, message: "Send Otp Successfully" })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports.otp = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const otpExits = await Otp.findOne({
            email: email,
            purpose: "forgot-password",
            otp: otp
        })
        if (!otpExits) {
            return res.status(400).json({ message: "OTP Not Correct" })
        }
        const user = await Users.findOne({
            email: email
        })
        if (!user) {
            return res.status(401).json({ message: "Email Not Correct" })
        }
        res.status(200).json({
            message: "Otp is correct"
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports.reset = async (req, res) => {
    try {
        const token = req.user.token;
        const newPassword = hashPassword(req.body.password);
        if (!token) {
            return res.status(401).json({
                message: "User Not Found"
            })
        }
        await Users.updateOne({ token: token }, { password: newPassword })
        res.status(200).json({
            message: "Reset Password Successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
