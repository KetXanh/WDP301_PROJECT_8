import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import OrderAssignmentForm from "./components/OrderAssignmentForm";
import { OrderFilter } from "./components/OrderFilter";
import { getAllOrders, assignOrder, getAllSaleStaff } from "@/services/SaleManager/ApiSaleManager";

export default function ManagerOrder() {
  const [orders, setOrders] = useState([]);
  const [saleStaff, setSaleStaff] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
    fetchSaleStaff();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      console.log("res: ", res.data.data);
      // Sử dụng cấu trúc API response thực tế
      const ordersData = res.data.data.orders || [];
      setOrders(ordersData);
    } catch {
      toast.error("Không thể tải danh sách order");
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
    // Lấy danh sách order đang chờ xử lý
    const pendingOrders = orders.filter(order => order.status === "pending");
    if (pendingOrders.length === 0 || saleStaff.length === 0) {
      toast.error("Không có order hoặc nhân viên để giao việc");
      return;
    }
    // Shuffle order ngẫu nhiên
    const shuffledOrders = [...pendingOrders].sort(() => Math.random() - 0.5);
    // Chia đều order cho staff
    const assignments = Array(saleStaff.length).fill().map(() => []);
    shuffledOrders.forEach((order, idx) => {
      assignments[idx % saleStaff.length].push(order);
    });
    let successCount = 0;
    let failCount = 0;
    for (let i = 0; i < saleStaff.length; i++) {
      for (let order of assignments[i]) {
        try {
          await assignOrder(order._id, saleStaff[i]._id);
          successCount++;
        } catch {
          failCount++;
        }
      }
    }
    fetchOrders();
    if (successCount > 0) toast.success(`Đã giao thành công ${successCount} order!`);
    if (failCount > 0) toast.error(`${failCount} order không thể giao!`);
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

  // Filter orders based on status
  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  // Tính toán thống kê
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
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
          Giao cho tất cả
        </Button>
      </div>

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
                <TableCell className="font-medium">{order.COD}</TableCell>
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
                <TableCell>{order.totalQuantity}</TableCell>
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
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell className="text-right">
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
    </div>
  );
} 