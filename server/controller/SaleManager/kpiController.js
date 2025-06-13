const KPI = require("../../models/sale/KPI");

// Tạo KPI mới
exports.createKPI = async (req, res) => {
  try {
    const kpiData = { ...req.body };

    // Gán người tạo nếu đã đăng nhập
    if (req.user && req.user._id) {
      kpiData.createdBy = req.user._id;
    }

    const kpi = await KPI.create(kpiData);
    res.status(201).json(kpi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả KPI (có thể lọc theo employeeId hoặc tháng)
exports.getKPIs = async (req, res) => {
  try {
    const { employeeId, month } = req.query;
    const query = {};
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = month;

    const kpis = await KPI.find(query).populate(
      "employeeId",
      "username email role"
    );
    res.json(kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy KPI theo ID
exports.getKPIById = async (req, res) => {
  try {
    const kpi = await KPI.findById(req.params.id).populate(
      "employeeId",
      "username email role"
    );
    if (!kpi) return res.status(404).json({ error: "KPI not found" });
    res.json(kpi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật KPI
exports.updateKPI = async (req, res) => {
  try {
    const updated = await KPI.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "KPI not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xoá KPI
exports.deleteKPI = async (req, res) => {
  try {
    const deleted = await KPI.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "KPI not found" });
    res.json({ message: "KPI deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
