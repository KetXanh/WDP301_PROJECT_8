import { useState, useEffect } from "react";
import { updateTask, getAllUsers } from "../../../services/Admin/SaleAPI";
import { toast } from "react-toastify";

export default function UpdateTask({ task, onSuccess }) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    employeeId: "",
    status: "pending",
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskData({
        title: task.title || "",
        description: task.description || "",
        deadline: task.deadline ? task.deadline.substring(0, 10) : "",
        employeeId: task.assignedTo?._id || "", // ⚠ lấy từ assignedTo
        status: task.status || "pending",
      });
    }
  }, [task]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllUsers(); // ✅ đúng API
        if (Array.isArray(res.data.users)) {
          setEmployees(res.data.users);
        }
      } catch (error) {
        toast.error("Lỗi khi tải danh sách nhân viên!");
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateTask(task._id, taskData); // ✅ SaleAPI.js sẽ tự map employeeId -> assignedTo
      toast.success("Cập nhật task thành công!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Lỗi khi cập nhật task!");
      console.error("Chi tiết lỗi:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tiêu đề
        </label>
        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          name="description"
          value={taskData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={taskData.deadline}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Người nhận
        </label>
        <select
          name="employeeId"
          value={taskData.employeeId}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Chọn nhân viên</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Trạng thái
        </label>
        <select
          name="status"
          value={taskData.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        >
          <option value="pending">Đang chờ</option>
          <option value="in_progress">Đang làm</option>
          <option value="completed">Hoàn thành</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Đang cập nhật..." : "Cập nhật Task"}
      </button>
    </form>
  );
}
