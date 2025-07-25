import { useEffect, useState } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/Admin/SaleAPI";
import { getAllUsers } from "../../services/Admin/SaleAPI";
import { Plus, Edit, Trash2, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    employeeId: "",
    status: "pending",
  });
  const [editTaskId, setEditTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks();
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map((task) => ({
        ...task,
        employeeId: task.assignedTo?._id || "",
      }));
      setTasks(normalized);
    } catch (err) {
      console.error("Lỗi khi lấy task:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await getAllUsers();
      const users = Array.isArray(res.data) ? res.data : [];
      const filtered = users.filter((user) => user.role === 0); // role 0 là nhân viên
      setEmployees(filtered);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách nhân viên:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

useEffect(() => {
  if (employeeFilter) {
    setFilteredTasks(
      tasks.filter((t) =>
        t.assignedTo?.username
          ?.toLowerCase()
          .includes(employeeFilter.toLowerCase())
      )
    );
  } else {
    setFilteredTasks(tasks);
  }
}, [employeeFilter, tasks]);


  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá task này?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (err) {
        console.error("Lỗi xoá task:", err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateTask(editTaskId, form);
      } else {
        await createTask(form);
      }
      setIsDialogOpen(false);
      setForm({
        title: "",
        description: "",
        employeeId: "",
        status: "pending",
      });
      setEditTaskId(null);
      setIsEditing(false);
      fetchTasks();
    } catch (err) {
      console.error("Lỗi khi tạo/cập nhật task:", err);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      employeeId: task.employeeId,
      status: task.status || "pending",
    });
    setEditTaskId(task._id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý công việc</h1>
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <Plus size={18} /> Add Task
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-50 w-[90vw] max-w-md min-h-[40vh]">
              <Dialog.Title className="text-xl font-bold mb-2">
                {isEditing ? "Cập nhật Task" : "Thêm Task"}
              </Dialog.Title>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  className="w-full border px-4 py-2 rounded"
                  type="text"
                  placeholder="Tiêu đề"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <textarea
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Mô tả"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
                <select
                  className="w-full border px-4 py-2 rounded"
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm({ ...form, employeeId: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn nhân viên</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.username} ({emp.email})
                    </option>
                  ))}
                </select>

                <select
                  className="w-full border px-4 py-2 rounded"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  required
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="in-progress">Đang thực hiện</option>
                  <option value="done">Hoàn thành</option>
                  <option value="late">Trễ hạn</option>
                </select>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {isEditing ? "Cập nhật" : "Thêm"}
                  </button>
                  <Dialog.Close asChild>
                    <button
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                      onClick={() => {
                        setIsEditing(false);
                        setForm({
                          title: "",
                          description: "",
                          employeeId: "",
                          status: "pending",
                        });
                      }}
                    >
                      Hủy
                    </button>
                  </Dialog.Close>
                </div>
              </form>
              <Dialog.Close asChild>
                <button className="absolute top-4 right-4 text-gray-500 hover:text-black">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Lọc theo tên nhân viên..."
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="border px-4 py-2 rounded w-full max-w-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Tiêu đề</th>
              <th className="px-4 py-2 text-left">Mô tả</th>
              <th className="px-4 py-2 text-left">Nhân viên</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Ngày tạo</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredTasks.map((task) => (
              <tr key={task._id}>
                <td className="px-4 py-2">{task.title}</td>
                <td className="px-4 py-2">{task.description}</td>
                <td className="px-4 py-2">
                  {task.assignedTo?.username || "N/A"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === "done"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : task.status === "late"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-yellow-700"
                    }`}
                  >
                    {task.status === "pending"
                      ? "Chờ xử lý"
                      : task.status === "in-progress"
                      ? "Đang thực hiện"
                      : task.status === "done"
                      ? "Hoàn thành"
                      : task.status === "late"
                      ? "Trễ hạn"
                      : task.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(task)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(task._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
