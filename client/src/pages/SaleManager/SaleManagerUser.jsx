import { useEffect, useState, useCallback } from "react";
import { getAllUsers, updateStaffRole, getUserStats } from "@/services/SaleManager/ApiSaleManager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: 0, label: "Khách hàng" },
  { value: 1, label: "Admin Dev" },
  { value: 2, label: "Sale Manager" },
  { value: 3, label: "Product Manager" },
  { value: 4, label: "Sale Staff" },
];

const ROLE_LABELS = {
  0: "Khách hàng",
  1: "Admin Dev",
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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPages: 0,
    roleDistribution: {
      0: 0, // Khách hàng
      1: 0, // Admin Dev
      2: 0, // Sale Manager
      3: 0, // Product Manager
      4: 0, // Sale Staff
    }
  });

  // Tối ưu fetchUsers: chỉ fetch theo page, role, search
  const fetchUsers = useCallback(async (pageParam = page, roleParam = role, searchParam = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageParam);
      params.append('limit', limit);
      
      // Chỉ thêm role và search nếu có giá trị
      if (roleParam !== "" && roleParam !== undefined && roleParam !== null) {
        params.append('role', roleParam);
      }
      if (searchParam !== "" && searchParam !== undefined && searchParam !== null) {
        params.append('search', searchParam);
      }
      
      console.log('Fetching users with params:', params.toString());
      const res = await getAllUsers({ params });
      setUsers(res.data?.users || []);
      setPagination(res.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
      
      // Cập nhật thống kê từ pagination
      if (res.data?.pagination) {
        setStats(prevStats => ({
          ...prevStats,
          totalUsers: res.data.pagination.totalItems,
          totalPages: res.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Không thể tải danh sách người dùng");
    }
    setLoading(false);
  }, [limit]);

  // Fetch thống kê
  const fetchStats = useCallback(async () => {
    try {
      const res = await getUserStats();
      if (res.data?.data) {
        setStats(prevStats => ({
          ...prevStats,
          totalUsers: res.data.data.totalUsers,
          roleDistribution: res.data.data.roleDistribution
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Gọi fetchUsers khi page, role, search thay đổi
  useEffect(() => {
    fetchUsers(page, role, search);
  }, [page, role, search, fetchUsers]);

  // Fetch stats khi component mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleChangeRole = async (userId, newRole) => {
    try {
      console.log('handleChangeRole called with:', { userId, newRole, newRoleType: typeof newRole });
      // Đảm bảo newRole là number
      const roleNumber = Number(newRole);
      console.log('Sending role as number:', roleNumber);
      await updateStaffRole(userId, roleNumber);
      const roleName = ROLE_LABELS[newRole] || "Khác";
      toast.success(`Cấp quyền ${roleName} thành công!`);
      fetchUsers(page, role, search);
      fetchStats(); // Cập nhật thống kê sau khi thay đổi role
    } catch (error) {
      console.error('Error in handleChangeRole:', error);
      console.error('Error response:', error?.response?.data);
      if (error?.response?.data?.code === 403) {
        toast.error("Bạn không thể thay đổi vai trò của người dùng có quyền cao hơn hoặc ngang bằng");
      } else {
        toast.error("Cấp quyền thất bại!");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    console.log('Role changed to:', value);
    setRole(value === "" ? "" : parseInt(value));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // fetchUsers(newPage, role, search); // Không gọi trực tiếp, useEffect sẽ tự gọi
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Sale Manager</h2>
      
                    {/* Thống kê theo role */}
       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
         <div className="bg-white p-4 rounded-lg shadow border">
           <div className="text-center">
             <div className="p-2 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
               <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
             </div>
             <p className="text-sm font-medium text-gray-600">Khách hàng</p>
             <p className="text-xl font-bold text-gray-900">{stats.roleDistribution[0] || 0}</p>
           </div>
         </div>
         
         <div className="bg-white p-4 rounded-lg shadow border">
           <div className="text-center">
             <div className="p-2 bg-red-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
               </svg>
             </div>
             <p className="text-sm font-medium text-gray-600">Admin Dev</p>
             <p className="text-xl font-bold text-gray-900">{stats.roleDistribution[1] || 0}</p>
           </div>
         </div>
         
         <div className="bg-white p-4 rounded-lg shadow border">
           <div className="text-center">
             <div className="p-2 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
             </div>
             <p className="text-sm font-medium text-gray-600">Sale Manager</p>
             <p className="text-xl font-bold text-gray-900">{stats.roleDistribution[2] || 0}</p>
           </div>
         </div>
         
         <div className="bg-white p-4 rounded-lg shadow border">
           <div className="text-center">
             <div className="p-2 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
               </svg>
             </div>
             <p className="text-sm font-medium text-gray-600">Product Manager</p>
             <p className="text-xl font-bold text-gray-900">{stats.roleDistribution[3] || 0}</p>
           </div>
         </div>
         
         <div className="bg-white p-4 rounded-lg shadow border">
           <div className="text-center">
             <div className="p-2 bg-yellow-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
               <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
               </svg>
             </div>
             <p className="text-sm font-medium text-gray-600">Sale Staff</p>
             <p className="text-xl font-bold text-gray-900">{stats.roleDistribution[4] || 0}</p>
           </div>
         </div>
       </div>
      <form className="flex gap-2 mb-4" onSubmit={handleSearch}>
                 <input
           type="text"
           placeholder="Tìm kiếm tên hoặc email..."
           value={search}
           onChange={e => {
             console.log('Search changed to:', e.target.value);
             setSearch(e.target.value);
           }}
           className="border px-2 py-1 rounded"
         />
                 <select
           value={role === "" ? "" : role.toString()}
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
                  {user.role === 1 && (
                    <span className="text-red-500 text-sm">Không thể thay đổi</span>
                  )}
                  {user.role !== 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          Cấp quyền <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.role !== 0 && (
                          <DropdownMenuItem onClick={() => handleChangeRole(user._id, 0)}>
                            Cấp quyền Khách hàng
                          </DropdownMenuItem>
                        )}
                        {user.role !== 2 && (
                          <DropdownMenuItem onClick={() => handleChangeRole(user._id, 2)}>
                            Cấp quyền Sale Manager
                          </DropdownMenuItem>
                        )}
                        {user.role !== 4 && (
                          <DropdownMenuItem onClick={() => handleChangeRole(user._id, 4)}>
                            Cấp quyền Sale Staff
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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