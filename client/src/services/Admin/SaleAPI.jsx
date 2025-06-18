import instance from "../CustomizeApi";

export const getAllUsers = () => {
  return instance.get("/saleManager/users");
};

export const getAllTasks = () => {
  return instance.get("/saleManager/task");
};

export const getTaskById = (id) => {
  return instance.get(`/saleManager/task/${id}`);
};

// ✅ Tạo task mới (map employeeId -> assignedTo)
export const createTask = (taskData) => {
  const payload = {
    ...taskData,
    assignedTo: taskData.employeeId,
  };
  delete payload.employeeId; // tránh gửi field không cần thiết
  return instance.post("/saleManager/task", payload);
};

// ✅ Cập nhật task theo ID (map employeeId -> assignedTo)
export const updateTask = (id, taskData) => {
  const payload = {
    ...taskData,
    assignedTo: taskData.employeeId,
  };
  delete payload.employeeId;
  return instance.put(`/saleManager/task/${id}`, payload);
};

export const deleteTask = (id) => {
  return instance.delete(`/saleManager/task/${id}`);
};
