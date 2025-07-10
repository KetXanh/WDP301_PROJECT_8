import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { getAllUser, banUser, unbanUser, deleteUser } from "../../services/Admin/AdminAPI";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const rowsPerPage = 5;

  const roleNames = {
    0: "User",
    1: "Admin Dev",
    2: "Sale Manager",
    3: "Product Manager",
    4: "Sale Staff",
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAllUser();
        if (Array.isArray(response.data)) {
          setAccounts(response.data);
        } else if (Array.isArray(response.data.users)) {
          setAccounts(response.data.users);
        } else {
          setAccounts([]);
        }
        setLoading(false);
      } catch (error) {
        setError("Không thể tải dữ liệu người dùng.");
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleExportExcel = () => {
    console.log("Xuất báo cáo Excel người dùng");
  };

  const handleChangeStatus = async (accountId, currentStatus) => {
    try {
      let response;
      if (currentStatus === "active") {
        response = await banUser(accountId);
      } else {
        response = await unbanUser(accountId);
      }
      setMessage(response.data.message || "Thao tác thành công");
      setAccounts((prev) =>
        prev.map((acc) =>
          acc._id === accountId
            ? { ...acc, status: response.data.user.status }
            : acc
        )
      );
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      alert("Không thể thay đổi trạng thái tài khoản.");
    }
  };

  const handleDeleteAccount = async (accountId) => {
  if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
  try {
    await deleteUser(accountId); // Hàm này cần import từ AdminAPI
    setAccounts((prev) => prev.filter((acc) => acc._id !== accountId));
    setMessage("Xóa tài khoản thành công");
    setTimeout(() => setMessage(""), 2000);
  } catch (err) {
    alert("Không thể xóa tài khoản.");
  }
};
  // Pagination logic
  const totalPages = Math.ceil(accounts.length / rowsPerPage);
  const paginatedAccounts = accounts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý tài khoản
          </h2>
          <p className="text-muted-foreground">
            Quản lý thông tin và trạng thái của các tài khoản người dùng
          </p>
        </div>
        <Button onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      {/* Hiển thị thông báo nếu có */}
      {message && (
        <div className="mb-2 px-4 py-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
          <CardDescription>
            Tổng quan các tài khoản trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : paginatedAccounts && paginatedAccounts.length > 0 ? (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-md">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Họ và tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Số điện thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Địa chỉ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-md">
                        Hoạt động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAccounts.map((account, index) => (
                      <tr key={account._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.address && account.address.length > 0
                            ? account.address[0].fullName
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {roleNames[account.role] || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.address && account.address.length > 0
                            ? account.address[0].phone
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.address && account.address.length > 0
                            ? `${account.address[0].street}, ${account.address[0].ward}, ${account.address[0].district}, ${account.address[0].province}`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              account.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {account.status === "active"
                              ? "Hoạt động"
                              : "Bị khóa"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant={
                              account.status === "active"
                                ? "destructive"
                                : "default"
                            }
                            size="sm"
                            onClick={() =>
                              handleChangeStatus(account._id, account.status)
                            }
                          >
                            {account.status === "active" ? "Ban" : "Unban"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAccount(account._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination controls */}
                <div className="flex justify-end items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Trang trước
                  </Button>
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Trang sau
                  </Button>
                </div>
              </>
            ) : (
              <p>Không có tài khoản nào để hiển thị.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
