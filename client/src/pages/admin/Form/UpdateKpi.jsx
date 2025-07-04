import { useState, useEffect } from "react";
import { updateKPI } from "../../../services/Admin/SaleAPI";

export default function UpdateKpi({ kpi, employees, onSuccess, onClose }) {
  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    targetSales: 0,
    achievedSales: 0,
    evaluation: "",
  });

  useEffect(() => {
    if (kpi) {
      setForm({
        employeeId: kpi.employeeId?._id || "",
        month: kpi.month,
        targetSales: kpi.targetSales,
        achievedSales: kpi.achievedSales,
        evaluation: kpi.evaluation || "",
      });
    }
  }, [kpi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateKPI(kpi._id, form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi khi cập nhật KPI:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        className="w-full border px-4 py-2 rounded"
        value={form.employeeId}
        onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
        required
      >
        <option value="">Chọn nhân viên</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.username} ({emp.email})
          </option>
        ))}
      </select>
      <input
        className="w-full border px-4 py-2 rounded"
        type="text"
        placeholder="Tháng (VD: 06/2025)"
        value={form.month}
        onChange={(e) => setForm({ ...form, month: e.target.value })}
        required
      />
      <input
        className="w-full border px-4 py-2 rounded"
        type="number"
        placeholder="Doanh số mục tiêu"
        value={form.targetSales}
        onChange={(e) =>
          setForm({ ...form, targetSales: Number(e.target.value) })
        }
        required
      />
      <input
        className="w-full border px-4 py-2 rounded"
        type="number"
        placeholder="Doanh số đạt được"
        value={form.achievedSales}
        onChange={(e) =>
          setForm({ ...form, achievedSales: Number(e.target.value) })
        }
      />
      <textarea
        className="w-full border px-4 py-2 rounded"
        placeholder="Đánh giá"
        value={form.evaluation}
        onChange={(e) => setForm({ ...form, evaluation: e.target.value })}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Cập nhật
      </button>
    </form>
  );
}
