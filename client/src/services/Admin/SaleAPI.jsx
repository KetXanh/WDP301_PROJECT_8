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


export const createTask = (taskData) => {
  const payload = {
    ...taskData,
    assignedTo: taskData.employeeId,
  };
  delete payload.employeeId; // tránh gửi field không cần thiết
  return instance.post("/saleManager/task", payload);
};


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

//Lấy danh sách tất cả KPI
export const getAllKPIs = () => {
  return instance.get("/saleManager/kpi");
};


export const getKPIById = (id) => {
  return instance.get(`/saleManager/kpi/${id}`);
};


export const createKPI = (kpiData) => {
  return instance.post("/saleManager/kpi", kpiData);
};


export const updateKPI = (id, kpiData) => {
  return instance.put(`/saleManager/kpi/${id}`, kpiData);
};


export const deleteKPI = (id) => {
  return instance.delete(`/saleManager/kpi/${id}`);
};

