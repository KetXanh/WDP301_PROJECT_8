import { Eye, Trash2, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";

export default function Order() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fakeData = [
      {
        id: "ORD001",
        customer: "Nguyễn Văn A",
        date: "2024-05-01",
        total: 1200000,
        status: "Đang xử lý",
      },
      {
        id: "ORD002",
        customer: "Trần Thị B",
        date: "2024-05-03",
        total: 890000,
        status: "Hoàn thành",
      },
    ];
    setOrders(fakeData);
  }, []);

  return (
    <div className="p-6 space-y-6 mt-10">
      {/* Header: Title + Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Search orders..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
              <Filter size={18} />
              Filter
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white p-4 rounded shadow w-64 space-y-4 z-50">
            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trạng thái
              </label>
              <select className="mt-1 w-full border border-gray-300 rounded px-2 py-1">
                <option value="">Tất cả</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>

            {/* Tổng tiền */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tổng tiền
              </label>
              <select className="mt-1 w-full border border-gray-300 rounded px-2 py-1">
                <option value="">Tất cả</option>
                <option value="lt500">Dưới 500.000đ</option>
                <option value="btw500-1m">500.000đ - 1.000.000đ</option>
                <option value="gt1m">Trên 1.000.000đ</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700">
              Áp dụng lọc
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Orders Table */}
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
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.total.toLocaleString()} đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Hoàn thành"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
