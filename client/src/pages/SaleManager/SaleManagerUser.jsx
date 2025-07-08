import { useEffect, useState, useCallback } from "react";
import { getAllUsers, updateStaffRole } from "@/services/SaleManager/ApiSaleManager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: 1, label: "Admin" },
  { value: 2, label: "Sale Manager" },
  { value: 4, label: "Sale Staff" },
];

export default function SaleManagerUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAllUsers({
        params: {
          page: params.page || page,
          limit,
          role: params.role !== undefined ? params.role : role || undefined,
          search: params.search !== undefined ? params.search : search || undefined,
        },
      });
      setUsers(res.data?.users || []);
      setPagination(res.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
    } catch {
      toast.error("Không thể tải danh sách người dùng");
    }
    setLoading(false);
  }, [page, role, search, limit]);

  useEffect(() => {
    fetchUsers();
  }, [page, role, fetchUsers]);

  const handleChangeRole = async (userId) => {
    try {
      await updateStaffRole(userId, 2); // 2 = Sale Manager
      toast.success("Cấp quyền Sale Manager thành công!");
      fetchUsers();
    } catch {
      toast.error("Cấp quyền thất bại!");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers({ page: 1, search });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1);
    fetchUsers({ page: 1, role: e.target.value });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchUsers({ page: newPage });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Sale Manager</h2>
      <form className="flex gap-2 mb-4" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Tìm kiếm tên hoặc email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={role}
          onChange={handleRoleChange}
          className="border px-2 py-1 rounded"
        >
          {ROLE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <Button type="submit">Tìm kiếm</Button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">STT</th>
              <th className="border px-4 py-2">Tên</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Vai trò</th>
              <th className="border px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id}>
                <td className="border px-4 py-2 text-center">{(pagination.currentPage - 1) * limit + idx + 1}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role === 2 ? "Sale Manager" : user.role === 4 ? "Sale Staff" : user.role === 1 ? "Admin" : "Khác"}</td>
                <td className="border px-4 py-2 text-center">
                  {user.role !== 2 && (
                    <Button size="sm" onClick={() => handleChangeRole(user._id)}>
                      Cấp quyền Sale Manager
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  {loading ? "Đang tải..." : "Không có người dùng nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button size="sm" disabled={pagination.currentPage <= 1} onClick={() => handlePageChange(pagination.currentPage - 1)}>
          Trang trước
        </Button>
        <span>
          Trang {pagination.currentPage} / {pagination.totalPages}
        </span>
        <Button size="sm" disabled={pagination.currentPage >= pagination.totalPages} onClick={() => handlePageChange(pagination.currentPage + 1)}>
          Trang sau
        </Button>
      </div>
    </div>
  );
} 