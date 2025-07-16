
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
import { useTranslation } from 'react-i18next';

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
    const [feedbackProduct, setFeedbackProduct] = useState(null);
    const ordersPerPage = 10;
    const { t } = useTranslation(['translation']);
    const orderByUser = async () => {
        try {
            const res = await getOrderByUser();
            if (res.status === 200) {
                setOrders(res.data.data)
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error);

        }
    }

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    useEffect(() => {
        orderByUser()
    }, []);

    useEffect(() => {
        let filtered = orders;

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

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
                return { label: t('order_history.status_delivered'), color: 'bg-green-100 text-green-800', icon: CheckCircle };
            case 'shipped':
                return { label: t('order_history.status_shipped'), color: 'bg-blue-100 text-blue-800', icon: Package };
            case 'processing':
                return { label: t('order_history.status_processing'), color: 'bg-yellow-100 text-yellow-800', icon: Clock };
            case 'pending':
                return { label: t('order_history.status_pending'), color: 'bg-orange-100 text-orange-800', icon: AlertCircle };
            case 'cancelled':
                return { label: t('order_history.status_cancelled'), color: 'bg-red-100 text-red-800', icon: XCircle };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
        }
    };

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">{t('order_history.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('order_history.title')}</h1>
                    <p className="text-gray-600">{t('order_history.subtitle')}</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder={t('order_history.search_placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('order_history.status_filter_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('order_history.status_all')}</SelectItem>
                                    <SelectItem value="pending">{t('order_history.status_pending')}</SelectItem>
                                    <SelectItem value="processing">{t('order_history.status_processing')}</SelectItem>
                                    <SelectItem value="shipped">{t('order_history.status_shipped')}</SelectItem>
                                    <SelectItem value="delivered">{t('order_history.status_delivered')}</SelectItem>
                                    <SelectItem value="cancelled">{t('order_history.status_cancelled')}</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Date Filter */}
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Thời gian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('order_history.date_all')}</SelectItem>
                                    <SelectItem value="7days">{t('order_history.date_7days')}</SelectItem>
                                    <SelectItem value="30days">{t('order_history.date_30days')}</SelectItem>
                                    <SelectItem value="90days">{t('order_history.date_90days')}</SelectItem>
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
                                {t('order_history.reset_filter')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{t('order_history.orders_list_title')} ({filteredOrders.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('order_history.no_orders_title')}</h3>
                                <p className="text-gray-500">{t('order_history.no_orders_message')}</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('order_history.table_order_number')}</TableHead>
                                                <TableHead>{t('order_history.table_date')}</TableHead>
                                                <TableHead>{t('order_history.table_products')}</TableHead>
                                                <TableHead>{t('order_history.table_status')}</TableHead>
                                                <TableHead>{t('order_history.table_total')}</TableHead>
                                                <TableHead>{t('order_history.table_actions')}</TableHead>
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
                                                                        +{order.items.length - 2} {t('order_history.more_products')}
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
                                                                {t('order_history.view_detail')}
                                                            </Button>

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
                                        <Pagination className="flex flex-wrap justify-center items-center gap-2">
                                            <PaginationContent className="flex flex-wrap gap-x-2 items-center justify-center">
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
                                                            <PaginationItem key={`ellipsis-${page}`}>
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
                    getStatusConfig={getStatusConfig}
                    selectedOrder={selectedOrder}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onFeedbackClick={(item) => {
                        setFeedbackProduct(item);
                        setIsFeedbackModalOpen(true);
                    }}
                />
                <OrderFeedbackModal
                    isOpen={isFeedbackModalOpen}
                    onClose={() => setIsFeedbackModalOpen(false)}
                    product={feedbackProduct}
                    selectedOrder={selectedOrder}
                />
            </div>
        </div>
    );
};

export default OrderHistory;
