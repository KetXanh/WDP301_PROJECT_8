const Users = require("../../models/user");
const TaskAssignment = require("../../models/sale/TaskAssignment");


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
