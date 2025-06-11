const Task = require("../../models/sale/Task");
const Users = require("../../models/user");

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
    if (req.query.employeeId) {
      query.assignedTo = req.query.employeeId;
    }

    const tasks = await Task.find(query)
      .populate("createdBy", "username email role");

    res.json({
      message: "Lấy danh sách task thành công",
      tasks
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy 1 task theo ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "username email role");

    if (!task) return res.status(404).json({ message: "Không tìm thấy task" });

    res.json({
      message: "Lấy thông tin task thành công",
      task
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Cập nhật task
exports.updateTask = async (req, res) => {
  try {
    const rawUser = req.user
    const user = await Users.findOne({ email: rawUser.email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const { title, description, status, deadline } = req.body;
    if (!title || !description || !status || !deadline) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Kiểm tra status hợp lệ
    const validStatuses = ["pending", "in-progress", "done", "late"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
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
      return res.status(404).json({ message: "Không tìm thấy task" });
    }

    res.json({
      message: "Cập nhật task thành công",
      task: updated
    });
  } catch (err) {
    res.status(400).json({ message: "Lỗi server", error: err.message });
  }
};

// Xoá task
exports.deleteTask = async (req, res) => {
  try {
    const rawUser = req.user
    const user = await Users.findOne({ email: rawUser.email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy task" });
    }

    res.status(200).json({ message: "Xóa task thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy danh sách nhân viên bán hàng (role 4)
exports.getAllSaleStaff = async (req, res) => {
  try {
    const users = await Users.find({ role: 4 }, "_id username email role");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên bán hàng" });
    }
    res.status(200).json({
      message: "Lấy danh sách nhân viên bán hàng thành công",
      users
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({}, "username email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};