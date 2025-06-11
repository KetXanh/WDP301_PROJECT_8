const TaskAssignment = require("../../models/sale/TaskAssignment");
const Task = require("../../models/sale/Task");
const Users = require("../../models/user");

// Gán task cho nhân viên
module.exports.assignTask = async (req, res) => {
    try {
        const user = req.user;
        const userID = await Users.findOne({ email: user.email });
        if (!userID) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const { taskId, assignedTo, deadline, notes } = req.body;

        // Kiểm tra task có tồn tại không
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy task" });
        }

        // Kiểm tra nhân viên có tồn tại và có role 4 (sale staff) không
        const staff = await Users.findOne({ _id: assignedTo, role: 4 });
        if (!staff) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên bán hàng" });
        }

        // Tạo assignment mới
        const assignment = await TaskAssignment.create({
            task: taskId,
            assignedTo,
            assignedBy: userID._id,
            deadline,
            notes
        });

        const populatedAssignment = await TaskAssignment.findById(assignment._id)
            .populate("task")
            .populate("assignedTo", "username email role")
            .populate("assignedBy", "username email role");

        res.status(201).json({
            message: "Gán task thành công",
            assignment: populatedAssignment
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Lấy danh sách task đã gán
module.exports.getAssignedTasks = async (req, res) => {
    try {
        const query = {};

        // Nếu có filter theo nhân viên
        if (req.query.staffId) {
            query.assignedTo = req.query.staffId;
        }

        const assignments = await TaskAssignment.find(query)
            .populate("task")
            .populate("assignedTo", "username email role")
            .populate("assignedBy", "username email role");

        res.json({
            message: "Lấy danh sách task đã gán thành công",
            assignments
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Cập nhật trạng thái task
module.exports.updateTaskStatus = async (req, res) => {
    try {
        const { task } = req.params;
        const { status } = req.body;

        // Kiểm tra status hợp lệ
        const validStatuses = ["pending", "in-progress", "done", "late"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        const updated = await TaskAssignment.findByIdAndUpdate(
            task,
            { status },
            { new: true }
        ).populate("task")
            .populate("assignedTo", "username email role")
            .populate("assignedBy", "username email role");

        if (!updated) {
            return res.status(404).json({ message: "Không tìm thấy task đã gán" });
        }

        res.json({
            message: "Cập nhật trạng thái thành công",
            assignment: updated
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Hủy gán task
module.exports.removeAssignment = async (req, res) => {
    try {
        const { task } = req.params;

        const deleted = await TaskAssignment.findByIdAndDelete(task);
        if (!deleted) {
            return res.status(404).json({ message: "Không tìm thấy task đã gán" });
        }

        res.json({ message: "Hủy gán task thành công" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

//gán task cho tất cả nhân viên 
module.exports.assignTaskToAllStaff = async (req, res) => {
    try {
        const user = req.user;
        const userID = await Users.findOne({ email: user.email });
        if (!userID) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        const { taskId, deadline, notes } = req.body;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy task" });
        }
        const staff = await Users.find({ role: 4 });
        if (!staff) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên bán hàng" });
        }
        const assignments = await TaskAssignment.create({
            task: taskId,
            assignedTo: staff._id,
            assignedBy: userID._id,
            deadline: deadline,
            notes: notes
        });
        res.status(201).json({ message: "Gán task thành công", assignment: assignments });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};
