const Task = require("../../models/sale/Task");
const Users = require("../../models/user");
const TaskAssignment = require("../../models/sale/TaskAssignment");
// Tạo task mới

module.exports.createTask = async (req, res) => {
  try {
    const user = req.user;
    const userID = await Users.findOne({ email: user.email });
    if (!userID) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    const { title, description, status, deadline } = req.body;
    const task = await Task.create({
      title,
      description,
      createdBy: userID._id,
      status: status,
      deadline: deadline
    });
    res.status(201).json({ message: "Tạo task thành công", task });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
}

// Lấy tất cả task (có thể lọc theo nhân viên)
exports.getTasks = async (req, res) => {
  try {
    const query = {};
    if (req.query.id) {
      query.assignedTo = req.query.id;
    }

    const tasks = await Task.find(query)
      .populate("createdBy", "username email role");
    
    // Lấy tất cả assignments cho các task này
    const taskAssignments = await TaskAssignment.find({ 
      task: { $in: tasks.map(task => task._id) } 
    })
      .populate("assignedTo", "username email role")
      .populate("assignedBy", "username email role");

    // Nhóm assignments theo task
    const assignmentsByTask = taskAssignments.reduce((acc, assignment) => {
      const taskId = assignment.task.toString();
      if (!acc[taskId]) {
        acc[taskId] = [];
      }
      acc[taskId].push(assignment);
      return acc;
    }, {});

    const final_result = tasks.map(task => {
      const taskAssignments = assignmentsByTask[task._id.toString()] || [];
      return {
        ...task.toObject(),
        assignments: taskAssignments, // Tất cả assignments cho task này
        assignedTo: taskAssignments.length > 0 ? taskAssignments[0].assignedTo : null, // Giữ lại cho backward compatibility
        assignedBy: taskAssignments.length > 0 ? taskAssignments[0].assignedBy : null, // Giữ lại cho backward compatibility
        assignmentCount: taskAssignments.length // Số lượng người được giao
      };
    });

    res.json({
      code: 200,
      message: "Lấy danh sách task thành công",
      data: final_result
    });
  } catch (err) {
    res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
  }
};

// Lấy 1 task theo ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "username email role");

    if (!task) return res.json({ code: 404, message: "Không tìm thấy task" });

    res.json({
      code: 200,
      message: "Lấy thông tin task thành công",
      data: task
    });
  } catch (err) {
    res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
  }
};

// Cập nhật task
exports.updateTask = async (req, res) => {
  try {
    const rawUser = req.user
    const user = await Users.findOne({ email: rawUser.email });
    if (!user) {
      return res.json({ code: 404, message: "Không tìm thấy người dùng" });
    }

    const { title, description, status, deadline } = req.body;
    if (!title || !description || !status || !deadline) {
      return res.json({ code: 400, message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Kiểm tra status hợp lệ
    const validStatuses = ["pending", "in-progress", "done", "late"];
    if (!validStatuses.includes(status)) {
      return res.json({ code: 400, message: "Trạng thái không hợp lệ" });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        deadline,
      },
      { new: true }
    ).populate("createdBy", "username email role");

    if (!updated) {
      return res.json({ code: 404, message: "Không tìm thấy task" });
    }

    res.json({
      code: 200,
      message: "Cập nhật task thành công",
      data: updated
    });
  } catch (err) {
    res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
  }
};

// Xoá task
exports.deleteTask = async (req, res) => {
  try {
    const rawUser = req.user
    const user = await Users.findOne({ email: rawUser.email });
    if (!user) {
      return res.json({ code: 404, message: "Không tìm thấy người dùng" });
    }

    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.json({ code: 404, message: "Không tìm thấy task" });
    }

    res.status(200).json({ message: "Xóa task thành công" });
  } catch (err) {
    res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
  }
};

// Lấy danh sách nhân viên bán hàng (role 4)
exports.getAllSaleStaff = async (req, res) => {
  try {
    const users = await Users.find({ role: 4 }, "_id username email role");
    if (!users || users.length === 0) {
      return res.json({ code: 404, message: "Không tìm thấy nhân viên bán hàng" });
    }
    res.json({
      code: 200,
      message: "Lấy danh sách nhân viên bán hàng thành công",
      data: users
    });
  } catch (err) {
    res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({}, "username email role");
    res.json({
      code: 200,
      message: "Lấy danh sách người dùng thành công",
      data: users
    });
  } catch (err) {
    res.json({ code: 500, message: "Lỗi máy chủ", error: err.message });
  }
};

// Thống kê task
exports.getTaskStats = async (req, res) => {
  try {
    // Tổng số task
    const totalTasks = await Task.countDocuments({});
    
    // Thống kê theo trạng thái
    const statusStats = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Task đã hoàn thành
    const completedTasks = await Task.countDocuments({ status: "done" });
    
    // Task đang thực hiện
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" });
    
    // Task chờ xử lý
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    
    // Task trễ hạn
    const lateTasks = await Task.countDocuments({ status: "late" });
    
    // Thống kê theo tháng (6 tháng gần nhất)
    const monthlyStats = await Task.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    // Top 5 task được gán nhiều nhất
    const topAssignedTasks = await TaskAssignment.aggregate([
      {
        $group: {
          _id: "$task",
          assignmentCount: { $sum: 1 }
        }
      },
      {
        $sort: { assignmentCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "_id",
          as: "taskInfo"
        }
      },
      {
        $unwind: "$taskInfo"
      },
      {
        $project: {
          _id: "$taskInfo._id",
          title: "$taskInfo.title",
          status: "$taskInfo.status",
          assignmentCount: 1
        }
      }
    ]);
    
    // Thống kê theo người tạo
    const creatorStats = await Task.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creator"
        }
      },
      {
        $unwind: "$creator"
      },
      {
        $group: {
          _id: "$createdBy",
          creatorName: { $first: "$creator.username" },
          taskCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { taskCount: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Tỷ lệ hoàn thành
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Task sắp đến hạn (trong 3 ngày tới)
    const upcomingDeadlines = await Task.countDocuments({
      deadline: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      status: { $nin: ["done", "late"] }
    });

    // Thống kê về assignments
    const totalAssignments = await TaskAssignment.countDocuments({});
    const averageAssignmentsPerTask = totalTasks > 0 ? (totalAssignments / totalTasks) : 0;
    const tasksWithMultipleAssignments = await TaskAssignment.aggregate([
      {
        $group: {
          _id: "$task",
          assignmentCount: { $sum: 1 }
        }
      },
      {
        $match: {
          assignmentCount: { $gt: 1 }
        }
      },
      {
        $count: "count"
      }
    ]);
    const multiAssignedTasks = tasksWithMultipleAssignments[0]?.count || 0;

    res.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        lateTasks,
        completionRate: Math.round(completionRate * 100) / 100,
        upcomingDeadlines,
        totalAssignments,
        averageAssignmentsPerTask: Math.round(averageAssignmentsPerTask * 100) / 100,
        multiAssignedTasks,
        statusStats: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        monthlyStats,
        topAssignedTasks,
        creatorStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
      error: error.message
    });
  }
};