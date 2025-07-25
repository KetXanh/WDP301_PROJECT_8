import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { orderStatistics } from "@/services/SaleManager/ApiSaleManager";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const STATUS_LABELS = {
  delivered: "Đã giao",
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  cancelled: "Đã hủy",
  shipped: "Đang giao",
};

const STATUS_COLORS = {
  delivered: "bg-green-100 text-green-700 border-green-300",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  processing: "bg-blue-100 text-blue-700 border-blue-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  shipped: "bg-purple-100 text-purple-700 border-purple-300",
  default: "bg-gray-100 text-gray-700 border-gray-300",
};

export default function OrderStatistics() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderStatistics();
      // Dữ liệu thực tế nằm ở res.data.data.orders
      setOrders(res.data.data.orders || []);
    } catch {
      toast.error("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy tất cả status có trong danh sách đơn hàng
  const allStatuses = Array.from(new Set(orders.map(order => order.status)));

  // Lọc đơn hàng theo status
  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter(order => order.status === statusFilter);

  return (
    <Card className="mt-10 shadow-lg border-0 bg-white rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800">Danh sách đơn hàng</CardTitle>
        {/* Filter as a segmented control */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            className={`px-4 py-1 rounded-full border transition-all duration-150 font-medium text-sm shadow-sm focus:outline-none ${statusFilter === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700"}`}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          {allStatuses.map(status => (
            <button
              key={status}
              className={`px-4 py-1 rounded-full border transition-all duration-150 font-medium text-sm shadow-sm focus:outline-none ${statusFilter === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700"}`}
              onClick={() => setStatusFilter(status)}
            >
              {STATUS_LABELS[status] || status}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-10 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                  <th className="px-4 py-2">Mã đơn</th>
                  <th className="px-4 py-2">Khách hàng</th>
                  <th className="px-4 py-2">Tổng tiền</th>
                  <th className="px-4 py-2">Số lượng</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr
                    key={order._id}
                    className="bg-white hover:bg-blue-50 transition rounded-xl shadow border border-gray-100"
                  >
                    <td className="px-4 py-2 font-mono text-xs text-blue-700">{order._id}</td>
                    <td className="px-4 py-2 font-medium">{order.user?.username}</td>
                    <td className="px-4 py-2 text-right">{order.totalAmount?.toLocaleString('vi-VN')}₫</td>
                    <td className="px-4 py-2 text-center">{order.totalQuantity}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${STATUS_COLORS[order.status] || STATUS_COLORS.default}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
