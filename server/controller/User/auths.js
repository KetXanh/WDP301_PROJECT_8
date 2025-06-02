const Otp = require('../../models/otp');
const Users = require('../../models/user');
const { hashPassword } = require('../../utils/bcryptHelper');
const generalOtp = require('../../utils/generateOtp')
const sendEmail = require('../../utils/sendEmail')
const { jwtDecode } = require('jwt-decode')
const { cloudinary } = require('../../middleware/upload.middleware')
module.exports.register = async (req, res) => {
    try {
        const { email, username } = req.body;
        req.body.password = await hashPassword(req.body.password);
        const emailExit = await Users.findOne({
            $or: [{ email }, { username }]
        })
        if (emailExit) {
            return res.status(400).json({
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
            email: email,
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
            return res.code(400).json({
                message: "Account is Vertify"
            })
        }
        const otp = generalOtp.generateOtp(6);
        const objVrtify = {
            email: email,
            otp: otp,
            purpose: "verify-email",
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
        const email = req.user.email;
        const newPassword = await hashPassword(req.body.password);
        if (!email) {
            return res.status(401).json({
                message: "User Not Found"
            })
        }
        await Users.updateOne({ email: email }, { password: newPassword })
        res.status(200).json({
            message: "Reset Password Successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await Users.findOne({
            email: email,
            status: "active"
        }).select("username email address avatar")
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            message: "Get Profile Successfully",
            user
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const currentEmail = req.user.email;

        const currentUser = await Users.findOne({ email: currentEmail });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found or inactive" });
        }

        if (req.body.email && req.body.email !== currentUser.email) {
            const emailExists = await Users.findOne({
                email: req.body.email,
                status: "active",
                _id: { $ne: currentUser._id }
            });
            if (emailExists) {
                return res.status(401).json({ message: "Email already exists" });
            }
        }

        if (req.body.username && req.body.username !== currentUser.username) {
            const usernameExists = await Users.findOne({
                username: req.body.username,
                status: "active",
                _id: { $ne: currentUser._id }
            });
            if (usernameExists) {
                return res.status(401).json({ message: "Username already exists" });
            }
        }

        const updateData = {
            username: req.body.username || currentUser.username,
            email: req.body.email || currentUser.email,
            address: req.body.address || currentUser.address,
            avatar: currentUser.avatar
        };

        const avatarFile = req.files?.avatar?.[0];
        if (avatarFile) {
            if (currentUser.avatar?.public_id) {
                await cloudinary.uploader.destroy(currentUser.avatar.public_id);
            }

            updateData.avatar = {
                url: avatarFile.path,
                public_id: avatarFile.filename
            };
        }
        const updatedUser = await Users.findOneAndUpdate(
            { email: currentEmail },
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: "Update profile successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports.loginGoogle = async (req, res) => {
    try {
        const { tokenGoogle } = req.body;
        const user = jwtDecode(tokenGoogle)
        const userExits = await Users.findOne({ email: user.email });
        if (!userExits) {
            const newUser = new Users({
                username: user.name,
                email: user.email,
                avatar: {
                    url: user.picture
                },
                password: "",
            })
            await newUser.save();

        }
        const dataToken = {
            username: userExits.username,
            email: userExits.email,
            role: userExits.role
        }
        const accessToken = jwt.sign(dataToken, process.env.TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(dataToken, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        await Users.findByIdAndUpdate(
            userExits._id,
            { re_token: refreshToken },
            { new: true }
        );
        return res.status(200).json({
            message: "Login successfully",
            accessToken,
            refreshToken,
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
