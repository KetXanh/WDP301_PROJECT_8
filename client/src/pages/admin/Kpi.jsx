import { useEffect, useState } from "react";
import { getAllKPIs, deleteKPI } from "../../services/Admin/SaleAPI";
import { getAllUsers } from "../../services/Admin/SaleAPI";
import { Plus, Edit, Trash2, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import AddKpi from "./Form/AddKpi";
import UpdateKpi from "./Form/UpdateKpi";

export default function Kpi() {
  const [kpis, setKpis] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);

  const fetchKpis = async () => {
    try {
      const res = await getAllKPIs();
      setKpis(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy KPI:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await getAllUsers();
      const users = Array.isArray(res.data) ? res.data : [];
      const filtered = users.filter((user) => user.role === 0);
      setEmployees(filtered);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách nhân viên:", err);
    }
  };

  useEffect(() => {
    fetchKpis();
    fetchEmployees();
  }, []);

  const filteredKpis = employeeFilter
    ? kpis.filter((kpi) =>
        kpi.employeeId?.username
          ?.toLowerCase()
          .includes(employeeFilter.toLowerCase())
      )
    : kpis;

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá KPI này?")) {
      try {
        await deleteKPI(id);
        fetchKpis();
      } catch (err) {
        console.error("Lỗi xoá KPI:", err);
      }
    }
  };

  const handleEdit = (kpi) => {
    setSelectedKpi(kpi);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">KPI Management</h1>
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setIsEditing(false);
                setSelectedKpi(null);
              }}
            >
              <Plus size={18} /> Add KPI
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-50 w-[90vw] max-w-md min-h-[40vh]">
              <Dialog.Title className="text-xl font-bold mb-2">
                {isEditing ? "Cập nhật KPI" : "Thêm KPI"}
              </Dialog.Title>
              {isEditing ? (
                <UpdateKpi
                  kpi={selectedKpi}
                  employees={employees}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    setIsEditing(false);
                    setSelectedKpi(null);
                    fetchKpis();
                  }}
                />
              ) : (
                <AddKpi
                  employees={employees}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    fetchKpis();
                  }}
                />
              )}
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
              <th className="px-4 py-2 text-left">Nhân viên</th>
              <th className="px-4 py-2 text-left">Tháng</th>
              <th className="px-4 py-2 text-left">Mục tiêu</th>
              <th className="px-4 py-2 text-left">Đạt được</th>
              <th className="px-4 py-2 text-left">Đánh giá</th>
              <th className="px-4 py-2 text-left">Ngày tạo</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredKpis.map((kpi) => (
              <tr key={kpi._id}>
                <td className="px-4 py-2">
                  {kpi.employeeId?.username || "N/A"}
                </td>
                <td className="px-4 py-2">{kpi.month}</td>
                <td className="px-4 py-2">{kpi.targetSales}</td>
                <td className="px-4 py-2">{kpi.achievedSales}</td>
                <td className="px-4 py-2">{kpi.evaluation}</td>
                <td className="px-4 py-2">
                  {new Date(kpi.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(kpi)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(kpi._id)}
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
