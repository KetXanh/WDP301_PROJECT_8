import { useEffect, useState, useCallback } from "react";
import { getAllUsers, updateStaffRole } from "@/services/SaleManager/ApiSaleManager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: 0, label: "Khách hàng" },
  { value: 1, label: "Admin" },
  { value: 2, label: "Sale Manager" },
  { value: 3, label: "Product Manager" },
  { value: 4, label: "Sale Staff" },
];

const ROLE_LABELS = {
  0: "Khách hàng",
  1: "Admin",
  2: "Sale Manager",
  3: "Product Manager",
  4: "Sale Staff",
};

export default function SaleManagerUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Tối ưu fetchUsers: chỉ fetch theo page, role, search
  const fetchUsers = useCallback(async (pageParam = page, roleParam = role, searchParam = search) => {
    setLoading(true);
    try {
      const res = await getAllUsers({
        params: {
          page: pageParam,
          limit,
          role: roleParam !== "" ? roleParam : undefined,
          search: searchParam !== "" ? searchParam : undefined,
        },
      });
      setUsers(res.data?.users || []);
      setPagination(res.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
    } catch {
      toast.error("Không thể tải danh sách người dùng");
    }
    setLoading(false);
  }, [page, role, search, limit]);

  // Gọi fetchUsers khi page, role, search thay đổi
  useEffect(() => {
    fetchUsers(page, role, search);
  }, [page, role, search, fetchUsers]);

  const handleChangeRole = async (userId) => {
    try {
      await updateStaffRole(userId, 2); // 2 = Sale Manager
      toast.success("Cấp quyền Sale Manager thành công!");
      fetchUsers(page, role, search);
    } catch {
      toast.error("Cấp quyền thất bại!");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    // fetchUsers(1, role, search); // Không gọi trực tiếp, useEffect sẽ tự gọi
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1);
    // fetchUsers(1, e.target.value, search); // Không gọi trực tiếp, useEffect sẽ tự gọi
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // fetchUsers(newPage, role, search); // Không gọi trực tiếp, useEffect sẽ tự gọi
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
              <th className="border px-4 py-2">Avatar</th>
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
                <td className="border px-4 py-2 text-center">
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.username} className="w-10 h-10 rounded-full object-cover inline-block" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">-</div>
                  )}
                </td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{ROLE_LABELS[user.role] || "Khác"}</td>
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
                <td colSpan={6} className="text-center py-4 text-muted-foreground">
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