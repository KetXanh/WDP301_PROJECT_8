const bcrypt = require('bcrypt');
const Users = require('../../models/user');
var jwt = require('jsonwebtoken');
const { comparePassword } = require('../../utils/bcryptHelper');


module.exports.login = async (req, res) => {
    try {
        const user = await Users.findOne({
            email: req.body.email,
        })
        if (!user) {
            return res.json({
                code: 400,
                message: "Email Not Correct"
            })
        }
        const checkPass = await comparePassword(req.body.password, user.password);
        if (!checkPass) {
            return res.json({
                code: 403,
                message: "Password Not Correct"
            })
        }
        if (user.status === "inactive" && user.role === 0) {
            return res.json({
                code: 401,
                message: "Account Not Active Please Verify"
            })
        }
        if (user.status === "inactive") {
            return res.json({
                code: 402,
                message: "Account Not Active"
            })
        }


        const dataToken = {
            username: user.username,
            email: user.email,
            role: user.role
        }
        const accessToken = jwt.sign(dataToken, process.env.TOKEN_SECRET, { expiresIn: "7d" });
        const refreshToken = jwt.sign(dataToken, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        await Users.findByIdAndUpdate(
            user._id,
            { re_token: refreshToken },
            { new: true }
        );
        res.json({
            code: 200,
            message: "Login successfully",
            accessToken,
            refreshToken,
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    const user = await Users.findOne({ re_token: refreshToken });
    if (!user) return res.json({ code: 403, message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
        if (err) return res.json({ code: 403, message: "Token expired or invalid" });

        const newAccessToken = jwt.sign({ username: user.name, email: user.email, role: user.role }, process.env.TOKEN_SECRET, {
            expiresIn: "15m",
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
};

