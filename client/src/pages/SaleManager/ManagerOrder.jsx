import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, Clock, CheckCircle, Eye, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import OrderAssignmentForm from "./components/OrderAssignmentForm";
import { OrderFilter } from "./components/OrderFilter";
import { getAllOrders, assignOrder, getAllSaleStaff, getOrderById, assignAllOrdersToStaff } from "@/services/SaleManager/ApiSaleManager";
import OrderDetailModal from "./components/OrderDetailModal";
import Chat from "./components/Chat";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ManagerOrder() {
  const [orders, setOrders] = useState([]);
  const [saleStaff, setSaleStaff] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAssignConfirmModal, setShowAssignConfirmModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchSaleStaff();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      if (res.data && res.data.success === false) {
        setOrders([]);
        setErrorMessage(res.data.message || "Có lỗi xảy ra khi tải đơn hàng");
        return;
      }
      // Sử dụng cấu trúc API response thực tế mới
      const ordersData = res.data?.data?.orders || [];
      setOrders(ordersData);
      setErrorMessage("");
    } catch {
      setErrorMessage("Không thể tải danh sách order");
      setOrders([]);
    }
  };

  const fetchSaleStaff = async () => {
    try {
      const res = await getAllSaleStaff();
      // Handle different possible response structures
      const staffData = res.data?.users || res.data || [];
      setSaleStaff(staffData);
    } catch {
      toast.error("Không thể tải danh sách nhân viên");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã giao hàng";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleAssignOrder = (order) => {
    setSelectedOrder(order);
    setShowAssignmentForm(true);
  };

  const handleAssignToAll = async () => {
    setShowAssignConfirmModal(true);
  };

  const confirmAssignToAll = async () => {
    try {
      const res = await assignAllOrdersToStaff();
      if (res.data && res.data.success === false) {
        toast.error(res.data.message || "Không thể giao tất cả order!");
        return;
      }
      
      // Hiển thị thông tin chi tiết về việc phân phối
      const { assignedCount, staffCount, skippedCount, distribution } = res.data.data || {};
      let message = res.data.message || "Đã giao tất cả order cho nhân viên thành công!";
      
      if (assignedCount && staffCount) {
        if (distribution) {
          const distributionInfo = Object.values(distribution).join(', ');
          message = `Đã gán ${assignedCount} đơn hàng cho ${staffCount} nhân viên (phân phối: ${distributionInfo} đơn)`;
        } else {
          const ordersPerStaff = Math.ceil(assignedCount / staffCount);
          message = `Đã gán ${assignedCount} đơn hàng cho ${staffCount} nhân viên (trung bình ${ordersPerStaff} đơn/người)`;
        }
        if (skippedCount > 0) {
          message += `. Bỏ qua ${skippedCount} đơn đã được gán trước đó.`;
        }
      }
      
      toast.success(message);
      fetchOrders();
      setShowAssignConfirmModal(false);
    } catch (error) {
      console.error('Error assigning orders:', error);
      toast.error("Không thể giao tất cả order!");
    }
  };

  const handleAssignmentComplete = async (staffId) => {
    if (!selectedOrder) return;
    try {
      await assignOrder(selectedOrder._id, staffId);
      toast.success("Giao order thành công");
      fetchOrders();
    } catch {
      toast.error("Không thể giao order");
    }
    setShowAssignmentForm(false);
  };

  const handleViewOrder = async (order) => {
    try {
      const res = await getOrderById(order._id);
      // Sửa: truyền thẳng object đơn hàng vào setOrderDetail
      setOrderDetail(res.data.data);
      setShowDetailModal(true);
    } catch {
      toast.error("Không thể lấy chi tiết đơn hàng");
    }
  };

  const handleChatWithUser = (user) => {
    setChatUser(user);
    setShowChatModal(true);
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order =>
    statusFilter === "all" || order.status === statusFilter
  );

  // Tính toán thống kê
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quản lý Order</h2>
        <p className="text-muted-foreground">
          Phân phối và theo dõi các order cho nhân viên
        </p>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Order</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả đơn hàng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Tổng giá trị đơn hàng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng đang chờ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giao</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng đã hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <OrderFilter 
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
        <Button
          variant="outline"
          onClick={handleAssignToAll}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Phân phối đều cho nhân viên
        </Button>
      </div>

      {/* Thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="text-center text-red-500 font-semibold my-4">
          {errorMessage}
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">STT</TableHead>
              <TableHead>Mã Order</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Địa chỉ giao hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow key={order._id}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{order._id}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{order.user?.username}</div>
                    <div className="text-gray-500 text-xs">{order.user?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-xs">
                    <div className="font-medium">{order.shippingAddress?.fullName}</div>
                    <div className="text-gray-500 text-xs">
                      {order.shippingAddress?.street}, {order.shippingAddress?.ward}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {order.shippingAddress?.district}, {order.shippingAddress?.province}
                    </div>
                    <div className="text-gray-500 text-xs">{order.shippingAddress?.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>{order.items?.reduce((sum, i) => sum + i.quantity, 0)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {order.payment === "CASH" ? "Tiền mặt" : order.payment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : ""}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleChatWithUser(order.user)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    {order.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignOrder(order)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Giao việc
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4 text-muted-foreground">
                  Không có order nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <OrderAssignmentForm
        open={showAssignmentForm}
        onOpenChange={setShowAssignmentForm}
        order={selectedOrder}
        staffList={saleStaff}
        onAssign={handleAssignmentComplete}
      />

      <OrderDetailModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        order={orderDetail}
      />

      {/* Modal chat với khách hàng */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-2xl p-0">
          {chatUser && <Chat initialUser={chatUser} />}
        </DialogContent>
      </Dialog>

      {/* Modal xác nhận phân phối đơn hàng */}
      <Dialog open={showAssignConfirmModal} onOpenChange={setShowAssignConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận phân phối đơn hàng</DialogTitle>
            <DialogDescription>
              Hệ thống sẽ phân phối các đơn hàng đang chờ xử lý cho tất cả nhân viên bán hàng dựa trên workload hiện tại. 
              Mỗi đơn hàng sẽ chỉ được gán cho một nhân viên duy nhất, ưu tiên nhân viên có ít việc hơn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignConfirmModal(false)}>
              Hủy
            </Button>
            <Button onClick={confirmAssignToAll}>
              Xác nhận phân phối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 