
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Package, Eye, Download, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getOrderByUser } from '../../services/Customer/ApiProduct';
import OrderDetailModal from '../../components/customer/OrderDetailModal';
import OrderFeedbackForm from '../../components/customer/OrderFeedbackForm';
import OrderFeedbackModal from '../../components/customer/OrderFeedbackModal';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackOrderId, setFeedbackOrderId] = useState(null);
    const ordersPerPage = 10;

    const orderByUser = async () => {
        try {
            const res = await getOrderByUser();
            console.log(res.data);

        } catch (error) {
            console.log(error);

        }
    }

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };



    // Mock data - replace with actual API call
    useEffect(() => {

        orderByUser()

        const mockOrders = [
            {
                id: '1',
                orderNumber: 'ORD-2024-001',
                date: '2024-01-15',
                status: 'delivered',
                total: 590000,
                items: [
                    { id: '1', name: 'Áo thun nam premium', quantity: 2, price: 250000 },
                    { id: '2', name: 'Quần jean slim fit', quantity: 1, price: 340000 }
                ],
                shippingAddress: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
                paymentMethod: 'Thẻ tín dụng'
            },
            {
                id: '2',
                orderNumber: 'ORD-2024-002',
                date: '2024-01-18',
                status: 'shipped',
                total: 450000,
                items: [
                    { id: '3', name: 'Giày sneaker trắng', quantity: 1, price: 450000 }
                ],
                shippingAddress: '456 Lê Văn Sỹ, Quận 3, TP.HCM',
                paymentMethod: 'COD'
            },
            {
                id: '3',
                orderNumber: 'ORD-2024-003',
                date: '2024-01-20',
                status: 'processing',
                total: 280000,
                items: [
                    { id: '4', name: 'Áo khoác hoodie', quantity: 1, price: 280000 }
                ],
                shippingAddress: '789 Cách Mạng Tháng 8, Quận 10, TP.HCM',
                paymentMethod: 'Chuyển khoản'
            },
            {
                id: '4',
                orderNumber: 'ORD-2024-004',
                date: '2024-01-22',
                status: 'cancelled',
                total: 150000,
                items: [
                    { id: '5', name: 'Mũ lưỡi trai', quantity: 1, price: 150000 }
                ],
                shippingAddress: '321 Võ Văn Tần, Quận 1, TP.HCM',
                paymentMethod: 'Thẻ tín dụng'
            }
        ];

        setTimeout(() => {
            setOrders(mockOrders);
            setFilteredOrders(mockOrders);
            setIsLoading(false);
        }, 1000);
    }, []);

    // Filter orders based on search term, status, and date
    useEffect(() => {
        let filtered = orders;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case '7days':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case '30days':
                    filterDate.setDate(now.getDate() - 30);
                    break;
                case '90days':
                    filterDate.setDate(now.getDate() - 90);
                    break;
            }

            filtered = filtered.filter(order => new Date(order.date) >= filterDate);
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);
    }, [orders, searchTerm, statusFilter, dateFilter]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'delivered':
                return { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle };
            case 'shipped':
                return { label: 'Đang giao', color: 'bg-blue-100 text-blue-800', icon: Package };
            case 'processing':
                return { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
            case 'pending':
                return { label: 'Chờ xác nhận', color: 'bg-orange-100 text-orange-800', icon: AlertCircle };
            case 'cancelled':
                return { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
                    <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm đơn hàng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                    <SelectItem value="processing">Đang xử lý</SelectItem>
                                    <SelectItem value="shipped">Đang giao</SelectItem>
                                    <SelectItem value="delivered">Đã giao</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Date Filter */}
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Thời gian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả thời gian</SelectItem>
                                    <SelectItem value="7days">7 ngày qua</SelectItem>
                                    <SelectItem value="30days">30 ngày qua</SelectItem>
                                    <SelectItem value="90days">90 ngày qua</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Reset Filter */}
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setDateFilter('all');
                                }}
                                className="flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Đặt lại
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Danh sách đơn hàng ({filteredOrders.length})</span>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Xuất Excel
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng</h3>
                                <p className="text-gray-500">Không tìm thấy đơn hàng nào phù hợp với bộ lọc của bạn.</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mã đơn hàng</TableHead>
                                                <TableHead>Ngày đặt</TableHead>
                                                <TableHead>Sản phẩm</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Tổng tiền</TableHead>
                                                <TableHead>Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentOrders.map((order) => {
                                                const statusConfig = getStatusConfig(order.status);
                                                const StatusIcon = statusConfig.icon;

                                                return (
                                                    <TableRow key={order.id}>
                                                        <TableCell className="font-medium">
                                                            {order.orderNumber}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                                {new Date(order.date).toLocaleDateString('vi-VN')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                {order.items.slice(0, 2).map((item) => (
                                                                    <div key={item.id} className="text-sm">
                                                                        {item.name} <span className="text-gray-500">x{item.quantity}</span>
                                                                    </div>
                                                                ))}
                                                                {order.items.length > 2 && (
                                                                    <div className="text-sm text-gray-500">
                                                                        +{order.items.length - 2} sản phẩm khác
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={statusConfig.color} variant="secondary">
                                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="font-semibold">
                                                            {order.total.toLocaleString('vi-VN')}đ
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="outline" size="sm" onClick={() => handleViewDetail(order)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Xem chi tiết
                                                            </Button>
                                                            {order.status === 'delivered' && (
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    className="ms-2 mb-2"
                                                                    onClick={() => {
                                                                        setFeedbackOrderId(order.id);
                                                                        setIsFeedbackModalOpen(true);
                                                                    }}
                                                                >
                                                                    Gửi đánh giá
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-6">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                                                        }}
                                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>

                                                {[...Array(totalPages)].map((_, index) => {
                                                    const page = index + 1;
                                                    if (
                                                        page === 1 ||
                                                        page === totalPages ||
                                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <PaginationItem key={page}>
                                                                <PaginationLink
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setCurrentPage(page);
                                                                    }}
                                                                    isActive={currentPage === page}
                                                                >
                                                                    {page}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    } else if (
                                                        page === currentPage - 2 ||
                                                        page === currentPage + 2
                                                    ) {
                                                        return (
                                                            <PaginationItem key={page}>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                        );
                                                    }
                                                    return null;
                                                })}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                                        }}
                                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
                <OrderDetailModal

                    selectedOrder={selectedOrder}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
                <OrderFeedbackModal
                    isOpen={isFeedbackModalOpen}
                    onClose={() => setIsFeedbackModalOpen(false)}
                    orderId={feedbackOrderId}
                    selectedOrder={orders.find(order => order.id === feedbackOrderId)}
                />
            </div>
        </div>
    );
};

export default OrderHistory;
