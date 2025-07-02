const Users = require("../../models/user");
const TaskAssignment = require("../../models/sale/TaskAssignment");
const { hashPassword } = require("../../utils/bcryptHelper");


module.exports.getTaskAssignment = async (req, res) => {
    try {
        const user = req.user;
        const userID = await Users.findOne({ email: user.email });
        if (!userID) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        const taskAssignment = await TaskAssignment.find({ assignedTo: userID._id });
        res.status(200).json({ message: "Lấy task đã gán thành công", taskAssignment });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
}

module.exports.updateTaskAssignment = async (req, res) => {
    try {
        const { taskAssignmentId } = req.params;
        const { status } = req.body;
        const taskAssignment = await TaskAssignment.findByIdAndUpdate(taskAssignmentId, { status }, { new: true });
        res.status(200).json({ message: "Cập nhật task đã gán thành công", taskAssignment });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email }).select("-password");
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.status(200).json({ message: "Lấy profile thành công", user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        const user = await Users.findOneAndUpdate(
            { email: req.user.email },
            req.body,
            { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.status(200).json({ message: "Cập nhật profile thành công", user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        // Kiểm tra mật khẩu hiện tại
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
        user.password = await hashPassword(newPassword);
        await user.save();
        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
