const Users = require("../../models/user");
const TaskAssignment = require("../../models/sale/TaskAssignment");
const { hashPassword } = require("../../utils/bcryptHelper");


module.exports.getTaskAssignment = async (req, res) => {
    try {
        const user = req.user;
        const userID = await Users.findOne({ email: user.email });
        if (!userID) {
            return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        const taskAssignment = await TaskAssignment.find({ assignedTo: userID._id })
            .populate("task")
            .populate("assignedTo", "username email role")
            .populate("assignedBy", "username email role");
        res.json({ code: 200, message: "Lấy task đã gán thành công", data: taskAssignment });
    } catch (err) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
    }
}

module.exports.updateTaskAssignment = async (req, res) => {
    try {
        const { taskAssignmentId } = req.params;
        const { status } = req.body;
        const taskAssignment = await TaskAssignment.findByIdAndUpdate(taskAssignmentId, { status }, { new: true })
            .populate("task")
            .populate("assignedTo", "username email role")
            .populate("assignedBy", "username email role");
        res.json({ code: 200, message: "Cập nhật task đã gán thành công", data: taskAssignment });
    } catch (err) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email }).select("-password");
            if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        res.json({ code: 200, message: "Lấy profile thành công", data: user });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        const user = await Users.findOneAndUpdate(
            { email: req.user.email },
            req.body,
            { new: true }
        ).select("-password");
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        res.json({ code: 200, message: "Cập nhật profile thành công", data: user });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        // Kiểm tra mật khẩu hiện tại
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.json({ code: 400, message: "Mật khẩu hiện tại không đúng" });
        user.password = await hashPassword(newPassword);
        await user.save();
        res.json({ code: 200, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });  
    }
};
