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
        const user = new Users(Users({ ...req.body, role: 2, status: "active" }));
        user.save();
        res.status(201).json({
            message: "Register successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().select("-password -re_token"); // Không trả về password và refresh token
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};