const TaskAssignment = require("../../models/sale/TaskAssignment");
const Task = require("../../models/sale/Task");
const Users = require("../../models/user");

// Gán task cho nhân viên (hỗ trợ nhiều người)
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

        // Hỗ trợ cả single user và multiple users
        const userIds = Array.isArray(assignedTo) ? assignedTo : [assignedTo];

        // Kiểm tra tất cả nhân viên có tồn tại và có role 4 (sale staff) không
        const staff = await Users.find({ _id: { $in: userIds }, role: 4 });
        if (staff.length !== userIds.length) {
            return res.status(404).json({ message: "Một số nhân viên không tồn tại hoặc không phải sale staff" });
        }

        // Tạo assignments cho tất cả users
        const assignments = [];
        for (const userId of userIds) {
            // Kiểm tra xem assignment đã tồn tại chưa
            const existingAssignment = await TaskAssignment.findOne({
                task: taskId,
                assignedTo: userId
            });

            if (!existingAssignment) {
                const assignment = await TaskAssignment.create({
                    task: taskId,
                    assignedTo: userId,
                    assignedBy: userID._id,
                    deadline,
                    notes
                });
                assignments.push(assignment);
            }
        }

        if (assignments.length === 0) {
            return res.json({ code: 400, message: "Tất cả nhân viên đã được giao task này" });
        }

        const populatedAssignments = await TaskAssignment.find({
            _id: { $in: assignments.map(a => a._id) }
        })
            .populate("task")
            .populate("assignedTo", "username email role")
            .populate("assignedBy", "username email role");

        res.json({ 
            code: 201, 
            message: `Gán task thành công cho ${assignments.length} nhân viên`, 
            data: populatedAssignments 
        });
    } catch (err) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
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
            code: 200,
            message: "Lấy danh sách task đã gán thành công",
            data: assignments
        });
    } catch (err) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
    }
};

// Lấy tất cả assignments cho một task cụ thể
module.exports.getTaskAssignments = async (req, res) => {
    try {
        const { taskId } = req.params;

        // Kiểm tra task có tồn tại không
        const task = await Task.findById(taskId);
        if (!task) {
            return res.json({ code: 404, message: "Không tìm thấy task" });
        }

        const assignments = await TaskAssignment.find({ task: taskId })
            .populate("assignedTo", "username email role")
            .populate("assignedBy", "username email role");

        res.json({
            code: 200,
            message: "Lấy danh sách assignments thành công",
            data: assignments
        });
    } catch (err) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
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
            return res.json({ code: 400, message: "Trạng thái không hợp lệ" });
        }

        // Kiểm tra task có tồn tại không
        const existingTask = await TaskAssignment.findById(task);

        console.log(existingTask)
        if (!existingTask) {
            return res.json({ code: 404, message: "Không tìm thấy task đã gán" });
        }

        const updated = await TaskAssignment.findByIdAndUpdate(
            task,
            { status },
            { new: true }
        ).populate("task")
            .populate("assignedTo", "username email role")
            .populate("assignedBy", "username email role");

        if (!updated) {
            return res.json({ code: 404, message: "Không tìm thấy task đã gán" });
        }

        res.json({
            message: "Cập nhật trạng thái thành công",
            assignment: updated
        });
    } catch (err) {
        console.error('Error updating task status:', err);
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
    }
};

// Hủy gán task cho một nhân viên cụ thể
module.exports.removeSpecificAssignment = async (req, res) => {
    try {
        const { taskId, userId } = req.params;

        // Kiểm tra task có tồn tại không
        const task = await Task.findById(taskId);
        if (!task) {
            return res.json({ code: 404, message: "Không tìm thấy task" });
        }

        // Kiểm tra user có tồn tại không
        const user = await Users.findById(userId);
        if (!user) {
            return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        }

        // Xóa assignment cụ thể
        const deleted = await TaskAssignment.findOneAndDelete({
            task: taskId,
            assignedTo: userId
        });

        if (!deleted) {
            return res.json({ code: 404, message: "Không tìm thấy assignment này" });
        }

        res.json({ 
            code: 200, 
            message: `Đã hủy gán task cho ${user.username}` 
        });
    } catch (err) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
    }
};

// Hủy gán task (giữ lại cho backward compatibility)
module.exports.removeAssignment = async (req, res) => {
    try {
        const { task } = req.params;

        const deleted = await TaskAssignment.findByIdAndDelete(task);
        if (!deleted) {
            return res.json({ code: 404, message: "Không tìm thấy task đã gán" });
        }

        res.json({ message: "Hủy gán task thành công" });
    } catch (err) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
    }
};

//gán task cho tất cả nhân viên 
module.exports.assignTaskToAllStaff = async (req, res) => {
    try {
        const user = req.user;
        const userID = await Users.findOne({ email: user.email });
        if (!userID) {
            return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        
        const { taskId, deadline, notes } = req.body;
        
        // Kiểm tra task có tồn tại không
        const task = await Task.findById(taskId);
        if (!task) {
            return res.json({ code: 404, message: "Không tìm thấy task" });
        }
        
        // Lấy tất cả nhân viên bán hàng
        const staff = await Users.find({ role: 4 });
        if (!staff || staff.length === 0) {
            return res.json({ code: 404, message: "Không tìm thấy nhân viên bán hàng" });
        }
        
        // Tạo assignment cho từng nhân viên
        const assignments = [];
        for (const staffMember of staff) {
            const assignment = await TaskAssignment.create({
                task: taskId,
                assignedTo: staffMember._id,
                assignedBy: userID._id,
                deadline: deadline,
                notes: notes
            });
            assignments.push(assignment);
        }
        
        res.json({ 
            code: 201, 
            message: `Gán task thành công cho ${assignments.length} nhân viên`, 
            data: assignments 
        });
    } catch (err) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
    }
};

// Gán tất cả task chưa được giao cho tất cả nhân viên
module.exports.assignUnassignedTasksToAllStaff = async (req, res) => {
    try {
        const user = req.user;
        const userID = await Users.findOne({ email: user.email });
        if (!userID) {
            return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        
        // Debug: Kiểm tra tổng số task trong database
        const totalTasks = await Task.countDocuments({});
        console.log('Total tasks in database:', totalTasks);
        
        // Nếu không có task nào trong database
        if (totalTasks === 0) {
            return res.json({ 
                code: 400, 
                message: "Không có task nào trong hệ thống. Vui lòng tạo task trước khi giao việc.",
                debug: {
                    totalTasks: 0,
                    assignedTaskIds: 0,
                    unassignedTasksCount: 0
                }
            });
        }
        
        // Lấy tất cả task chưa được giao (không có trong TaskAssignment)
        const assignedTaskIds = await TaskAssignment.distinct('task');
        console.log('Assigned task IDs:', assignedTaskIds);
        console.log('Number of assigned tasks:', assignedTaskIds.length);
        
        const unassignedTasks = await Task.find({
            _id: { $nin: assignedTaskIds }
        });
        console.log('Unassigned tasks found:', unassignedTasks.length);
        console.log('Unassigned task IDs:', unassignedTasks.map(t => t._id.toString()));
        
        if (!unassignedTasks || unassignedTasks.length === 0) {
            return res.json({ 
                code: 400, 
                message: "Tất cả task đã được giao. Không có task nào chưa được giao.",
                debug: {
                    totalTasks,
                    assignedTaskIds: assignedTaskIds.length,
                    unassignedTasksCount: unassignedTasks.length
                }
            });
        }
        
        // Lấy tất cả nhân viên bán hàng
        const staff = await Users.find({ role: 4 });
        console.log('Sale staff found:', staff.length);
        if (!staff || staff.length === 0) {
            return res.json({ code: 404, message: "Không tìm thấy nhân viên bán hàng" });
        }
        
        // Chia đều task cho staff
        const assignments = [];
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < unassignedTasks.length; i++) {
            const task = unassignedTasks[i];
            const staffIndex = i % staff.length;
            const staffMember = staff[staffIndex];
            
            try {
                const assignment = await TaskAssignment.create({
                    task: task._id,
                    assignedTo: staffMember._id,
                    assignedBy: userID._id,
                    deadline: task.deadline || task.dueDate,
                    notes: `Tự động gán từ "Giao cho tất cả"`
                });
                assignments.push(assignment);
                successCount++;
            } catch (error) {
                console.log('Error creating assignment:', error.message);
                failCount++;
            }
        }
        
        res.json({ 
            code: 201, 
            message: `Đã giao thành công ${successCount} công việc cho ${staff.length} nhân viên${failCount > 0 ? `, ${failCount} công việc không thể giao` : ''}`, 
            data: { 
                assignments, 
                successCount, 
                failCount, 
                totalStaff: staff.length 
            } 
        });
    } catch (err) {
        console.log('Error in assignUnassignedTasksToAllStaff:', err.message);
        res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
    }
};
