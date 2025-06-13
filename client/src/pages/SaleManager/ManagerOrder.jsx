import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { toast } from "sonner";
import OrderAssignmentForm from "./components/OrderAssignmentForm";
import { OrderFilter } from "./components/OrderFilter";

// Mock data for testing
const DEMO_ORDERS = [
  {
    _id: 1,
    orderNumber: "ORD001",
    customerName: "Nguyễn Văn A",
    totalAmount: 1500000,
    status: "pending",
    quantity: 5,
    assignedTo: null,
  },
  {
    _id: 2,
    orderNumber: "ORD002",
    customerName: "Trần Thị B",
    totalAmount: 2300000,
    status: "assigned",
    quantity: 3,
    assignedTo: "Nguyễn Văn X",
  },
  {
    _id: 3,
    orderNumber: "ORD003",
    customerName: "Lê Văn C",
    totalAmount: 4500000,
    status: "completed",
    quantity: 8,
    assignedTo: "Trần Thị Y",
  },
];

const DEMO_STAFF = [
  { _id: 1, name: "Nguyễn Văn X", role: "staff" },
  { _id: 2, name: "Trần Thị Y", role: "staff" },
  { _id: 3, name: "Lê Văn Z", role: "staff" },
];

export default function ManagerOrder() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "assigned":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "assigned":
        return "Đã giao";
      case "completed":
        return "Hoàn thành";
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

  const handleAssignToAll = () => {
    const pendingOrders = orders.filter(order => order.status === "pending");
    if (pendingOrders.length === 0) {
      toast.error("Không có order nào đang chờ xử lý");
      return;
    }

    // TODO: Replace with actual API call
    const updatedOrders = orders.map(order => {
      if (order.status === "pending") {
        return { ...order, status: "assigned", assignedTo: "Tất cả nhân viên" };
      }
      return order;
    });
    setOrders(updatedOrders);
    toast.success("Đã giao tất cả order cho nhân viên");
  };

  const handleAssignmentComplete = () => {
    // TODO: Replace with actual API call
    setOrders(orders.map(order => 
      order._id === selectedOrder._id 
        ? { ...order, status: "assigned" }
        : order
    ));
    toast.success("Cập nhật trạng thái order thành công");
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Quản lý Order</h2>
        <p className="text-muted-foreground">
          Phân phối và theo dõi các order cho nhân viên
        </p>
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
              <TableHead>Mã Order</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Người xử lý</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>{order.assignedTo || "-"}</TableCell>
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
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
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
        staffList={DEMO_STAFF}
        onAssign={handleAssignmentComplete}
      />
    </div>
  );
} 