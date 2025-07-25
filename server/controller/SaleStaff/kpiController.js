const KPI = require("../../models/sale/KPI");
const Users = require("../../models/user");

exports.getMyKPIs = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        const kpis = await KPI.find({ employeeId: user._id });
        res.json({ code: 200, message: "Lấy KPI thành công", data: kpis });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

exports.getMyKPIById = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        const kpi = await KPI.findOne({ _id: req.params.id, employeeId: user._id });
        if (!kpi) return res.json({ code: 404, message: "Không tìm thấy KPI" });
        res.json({ code: 200, message: "Lấy chi tiết KPI thành công", data: kpi });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

exports.updateMyKPI = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email });
        if (!user) return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        const kpi = await KPI.findOneAndUpdate(
            { _id: req.params.id, employeeId: user._id },
            req.body,
            { new: true }
        );
        if (!kpi) return res.json({ code: 404, message: "Không tìm thấy KPI" });
        res.json({ code: 200, message: "Cập nhật KPI thành công", data: kpi });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
}; 