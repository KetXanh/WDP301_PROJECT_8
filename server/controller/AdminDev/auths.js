const Users = require('../../models/user');
const { hashPassword } = require('../../utils/bcryptHelper');

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
        const user = new Users({ ...req.body, role: 1, status: "active" });
        user.save();
        res.status(201).json({
            message: "Register successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
