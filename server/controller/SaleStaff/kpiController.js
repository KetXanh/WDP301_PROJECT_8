const KPI = require("../../models/sale/KPI");
const Users = require("../../models/user");

exports.getMyKPIs = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const kpis = await KPI.find({ employeeId: user._id });
        res.status(200).json({ message: "Lấy KPI thành công", kpis });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getMyKPIById = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const kpi = await KPI.findOne({ _id: req.params.id, employeeId: user._id });
        if (!kpi) return res.status(404).json({ message: "Không tìm thấy KPI" });
        res.status(200).json({ message: "Lấy chi tiết KPI thành công", kpi });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.updateMyKPI = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        const kpi = await KPI.findOneAndUpdate(
            { _id: req.params.id, employeeId: user._id },
            req.body,
            { new: true }
        );
        if (!kpi) return res.status(404).json({ message: "Không tìm thấy KPI" });
        res.status(200).json({ message: "Cập nhật KPI thành công", kpi });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}; 