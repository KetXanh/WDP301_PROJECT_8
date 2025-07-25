import { Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  getAllOrders,
  updateOrderSatatus,
} from "../../services/Admin/AdminAPI";
import OrderDetail from "./Form/OrderDetail";
const statusOptions = [
  {
    value: "pending",
    label: "Đang chờ xử lý",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "processing",
    label: "Đang xử lý",
    color: "bg-orange-100 text-orange-800",
  },
  { value: "shipped", label: "Đang giao", color: "bg-blue-100 text-blue-800" },
  {
    value: "delivered",
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Đã huỷ", color: "bg-red-100 text-red-800" },
  { value: "failed", label: "Thất bại", color: "bg-gray-100 text-gray-800" },
];

const getStatusOption = (value) =>
  statusOptions.find((s) => s.value === value) || {};

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
    }
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      await updateOrderSatatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter ? order.status === statusFilter : true) &&
      (paymentFilter ? order.payment === paymentFilter.toUpperCase() : true) &&
      (searchTerm
        ? order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilter = () => {
    setStatusFilter("");
    setPaymentFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order</h1>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên khách hàng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
              <Filter size={18} />
              Filter
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white p-4 rounded shadow w-64 space-y-4 z-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Tất cả</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thanh toán
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Tất cả</option>
                <option value="cash">CASH</option>
                <option value="vnpay">VNPay</option>
                <option value="momo">Momo</option>
              </select>
            </div>

            <button
              onClick={handleResetFilter}
              className="text-sm text-red-600 hover:underline"
            >
              Xoá lọc
            </button>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Thanh toán
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Trạng thái thanh toán
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4">{order._id}</td>
                <td className="px-6 py-4">
                  {order.user?.username || "Không rõ"}
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  {order.totalAmount.toLocaleString()} đ
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          getStatusOption(order.status).color
                        }`}
                      >
                        {getStatusOption(order.status).label}
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="bg-white border rounded shadow-md z-50">
                      {statusOptions.map((option) => (
                        <DropdownMenu.Item
                          key={option.value}
                          onSelect={() =>
                            handleChangeStatus(order._id, option.value)
                          }
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${option.color}`}
                        >
                          {option.label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </td>
                <td className="px-6 py-4 text-center">{order.payment}</td>
                <td className="px-6 py-4 text-center">{order.paymentStatus}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setSelectedOrderId(order._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {selectedOrderId && (
        <OrderDetail
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
