import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Filter,
  TrendingUp,
  Package,
  DollarSign,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMyOrders, getMyOrderById, updateMyOrderStatus, getMyOrderStatistics } from '@/services/SaleStaff/ApiSaleStaff';
import { toast } from 'sonner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: ''
  });
  const [filter, setFilter] = useState('all');
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    completedAssignments: 0,
    completionRate: 0,
    statusStats: []
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
      setProducts(res.data.products || []);
    } catch {
      toast.error('Không thể tải danh sách đơn hàng');
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await getMyOrderStatistics();
      if (res.data?.data) {
        const data = res.data.data;
        setStats({
          totalAssignments: data.summary?.totalAssignments || 0,
          completedAssignments: data.summary?.completedAssignments || 0,
          completionRate: data.summary?.completionRate || 0,
          statusStats: data.statusStats || []
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewOrder = async (order) => {
    setLoadingDetail(true);
    try {
      const res = await getMyOrderById(order._id);
      setSelectedOrder(res.data.orderDetail);
      setProducts(res.data.products || []);
      setShowDetailModal(true);
    } catch {
      toast.error('Không thể lấy chi tiết đơn hàng');
    }
    setLoadingDetail(false);
  };

  const handleUpdateOrder = (order) => {
    // Check if order status allows updates
    if (isStatusBlocked(order.status)) {
      toast.error(`Không thể cập nhật trạng thái đơn hàng với trạng thái "${getStatusText(order.status)}"`);
      return;
    }
    
    if (!canUpdateStatus(order.status)) {
      toast.error('Trạng thái đơn hàng không hợp lệ để cập nhật');
      return;
    }
    
    setSelectedOrder(order);
    setUpdateForm({
      status: order.status,
      notes: order.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async () => {
    // Additional validation before submitting
    if (isStatusBlocked(selectedOrder?.status)) {
      toast.error(`Không thể cập nhật trạng thái đơn hàng với trạng thái "${getStatusText(selectedOrder?.status)}"`);
      return;
    }

    if (!canUpdateStatus(selectedOrder?.status)) {
      toast.error('Trạng thái đơn hàng không hợp lệ để cập nhật');
      return;
    }

    try {
      await updateMyOrderStatus(selectedOrder._id, { status: updateForm.status });
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      setShowUpdateModal(false);
      fetchOrders();
      fetchStats(); // Refresh statistics after update
    } catch {
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500 text-white';
      case 'shipped':
        return 'bg-blue-500 text-white';
      case 'processing':
        return 'bg-amber-500 text-white';
      case 'pending':
        return 'bg-slate-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      case 'failed':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Đã giao';
      case 'shipped':
        return 'Đang giao';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      case 'failed':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

  // Helper function to check if status can be updated
  const canUpdateStatus = (status) => {
    const allowedStatuses = ['pending', 'processing', 'shipped'];
    return allowedStatuses.includes(status);
  };

  // Helper function to check if status is blocked from updates
  const isStatusBlocked = (status) => {
    const blockedStatuses = ['delivered', 'cancelled', 'failed'];
    return blockedStatuses.includes(status);
  };



  // Sort orders by createdAt (orderId?.createdAt or createdAt), newest first
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.orderId?.createdAt ? new Date(a.orderId.createdAt) : new Date(a.createdAt);
    const dateB = b.orderId?.createdAt ? new Date(b.orderId.createdAt) : new Date(b.createdAt);
    return dateB - dateA;
  });

  const filteredOrders = sortedOrders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Đơn hàng đang chờ xử lý</h1>
              <p className="text-gray-600">Quản lý và cập nhật trạng thái đơn hàng</p>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                {stats.completedAssignments || 0}/{stats.totalAssignments || 0} đơn hàng đã giao
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssignments || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedAssignments || 0}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(stats.completionRate || 0)}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(stats.totalAssignments || 0) - (stats.completedAssignments || 0)}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      {stats.statusStats && stats.statusStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.statusStats.map((stat) => (
                <div key={stat._id} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${getStatusColor(stat._id)}`}>
                    <span className="text-xs font-medium">{stat.count}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{getStatusText(stat._id)}</p>
                  <p className="text-xs text-gray-500">{stat.count} đơn</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combined Filter and Orders List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipped">Đang giao</SelectItem>
                  <SelectItem value="delivered">Đã giao</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">
                {filteredOrders.length} đơn hàng
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order.orderId?.COD || order.orderId?._id || 'Chưa có thông tin'}</TableCell>
                  <TableCell className="font-medium">
                    {order.orderId?.totalAmount?.toLocaleString('vi-VN') || '-'}đ
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="ml-1">{getStatusText(order.status)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {order.orderId?.createdAt ? new Date(order.orderId.createdAt).toLocaleDateString('vi-VN') : ''}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        disabled={!order.orderId}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateOrder(order)}
                        disabled={isStatusBlocked(order.status)}
                        title={isStatusBlocked(order.status) ? 'Không thể cập nhật trạng thái đơn hàng đã hoàn thành' : 'Cập nhật trạng thái'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button size="sm" variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Trước</Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button size="sm" variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Sau</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={(open) => {
        setShowDetailModal(open);
        if (!open) {
          setSelectedOrder(null);
          setProducts([]);
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.COD || selectedOrder?._id || 'Chưa có thông tin'}</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : selectedOrder ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin giao hàng</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Tên:</span> {selectedOrder?.shippingAddress?.fullName}</p>
                    <p><span className="font-medium">SĐT:</span> {selectedOrder?.shippingAddress?.phone}</p>
                    <p><span className="font-medium">Địa chỉ:</span> {selectedOrder?.shippingAddress?.street}, {selectedOrder?.shippingAddress?.ward}, {selectedOrder?.shippingAddress?.district}, {selectedOrder?.shippingAddress?.province}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-wrap gap-4 items-center">
                      <span className="font-medium">Trạng thái:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>{getStatusText(selectedOrder.status)}</Badge>
                      <span className="font-medium">Ngày tạo:</span>
                      <span>{selectedOrder?.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN') : '-'}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      <span className="font-medium">Phương thức thanh toán:</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-semibold">{selectedOrder?.payment || '-'}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center mt-2">
                      <span className="font-medium">Trạng thái thanh toán:</span>
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg font-semibold">{selectedOrder?.paymentStatus || '-'}</span>
                    </div>
                  </div>
                  {/* Note section: always show */}
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-base text-yellow-900 shadow-inner">
                    <span className="font-bold block mb-1">Ghi chú:</span>
                    <span>{selectedOrder?.note && selectedOrder.note.trim() !== '' ? selectedOrder.note : 'Không có ghi chú'}</span>
                  </div>
                </div>
              </div>
              {isStatusBlocked(selectedOrder?.status) && (
                <p className="text-sm text-red-600 mt-1">
                  Không thể cập nhật trạng thái đơn hàng đã hoàn thành
                </p>
              )}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Danh sách sản phẩm</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ảnh</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Trọng lượng</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Đơn giá</TableHead>
                      <TableHead>Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  {products.length > 0 ? (
                    <TableBody>
                      {products.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item.product?.image?.url && (
                              <img src={item.product.image.url} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                            )}
                          </TableCell>
                          <TableCell>{item.product?.name || ''}</TableCell>
                          <TableCell className="max-w-[180px] truncate">{item.product?.description || ''}</TableCell>
                          <TableCell>{item.variant?.weight ? `${item.variant.weight}g` : '-'}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.price?.toLocaleString('vi-VN')}đ</TableCell>
                          <TableCell className="font-medium">{(item.quantity * item.price)?.toLocaleString('vi-VN')}đ</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <div className="text-center text-gray-500 py-8">Không có sản phẩm nào</div>
                  )}
                </Table>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Tổng tiền: {selectedOrder?.totalAmount?.toLocaleString('vi-VN') || '-'}đ
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">Không thể lấy chi tiết đơn hàng</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <Select 
                value={updateForm.status} 
                onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
                disabled={isStatusBlocked(selectedOrder?.status)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipped">Đang giao</SelectItem>
                  <SelectItem value="delivered">Đã giao</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <Textarea
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                placeholder="Thêm ghi chú về trạng thái đơn hàng..."
                rows={3}
                disabled
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmitUpdate}
              disabled={isStatusBlocked(selectedOrder?.status)}
            >
              Cập nhật
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders; 