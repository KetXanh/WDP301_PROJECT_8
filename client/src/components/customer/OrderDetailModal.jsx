import React from 'react';
import { Calendar, Package, MapPin, CreditCard, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const OrderDetailModal = ({ selectedOrder, isModalOpen, setIsModalOpen, getStatusConfig, onFeedbackClick }) => {
    const { t } = useTranslation(['translation']);
    if (!selectedOrder) return null;

    const getPaymentStatusConfig = (status) => {
        switch (status) {
            case 'success':
                return { label: t('order_detail.payment_status_success'), color: 'bg-green-100 text-green-800', icon: CheckCircle };
            case 'failed':
                return { label: t('order_detail.payment_status_failed'), color: 'bg-yellow-100 text-yellow-800', icon: Clock };
            case 'pending':
                return { label: t('order_detail.payment_status_pending'), color: 'bg-orange-100 text-orange-800', icon: AlertCircle };
            case 'cancelled':
                return { label: t('order_detail.payment_status_cancelled'), color: 'bg-red-100 text-red-800', icon: XCircle };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
        }
    };
    const statusConfig = getStatusConfig(selectedOrder.status);
    const StatusIcon = statusConfig.icon;

    const paymentStatusConfig = getPaymentStatusConfig(selectedOrder.paymentStatus);
    const PaymentStatusIcon = paymentStatusConfig.icon;
    // const subtotal = selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{selectedOrder.orderNumber}</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {t('order_detail.order_date')} {new Date(selectedOrder.date).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                        <Badge className={statusConfig.color} variant="secondary">
                            <StatusIcon className="w-4 h-4 mr-2" />
                            {statusConfig.label}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    {t('order_detail.items_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{t('order_detail.quantity')} {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-900">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.price.toLocaleString('vi-VN')}đ
                                                </div>
                                            </div>
                                            {selectedOrder.status === 'delivered' && (
                                                <div className="mt-6 flex justify-end">
                                                    <button
                                                        onClick={() => onFeedbackClick(item)}
                                                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                                                    >
                                                        {t('order_history.send_feedback')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                </div>

                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    {t('order_detail.shipping_address_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                                {selectedOrder.note && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                        <strong className="text-sm text-gray-600">{t('order_detail.note_label')}</strong>
                                        <p className="text-sm text-gray-700 mt-1">{selectedOrder.note}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tracking Info */}
                        {selectedOrder.trackingNumber && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        {t('order_detail.tracking_title')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('order_detail.tracking_number')}</span>
                                            <span className="font-medium">{selectedOrder.trackingNumber}</span>
                                        </div>
                                        {selectedOrder.estimatedDelivery && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">{t('order_detail.estimated_delivery')}</span>
                                                <span className="font-medium">
                                                    {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('order_detail.summary_title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">

                                {/* {selectedOrder.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>{t('order_detail.discount')}:</span>
                                        <span>-{selectedOrder.discount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                )} */}

                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>{t('order_detail.total')}</span>
                                    <span>{selectedOrder.total.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    {t('order_detail.payment_method_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-gray-700">
                                        {selectedOrder.paymentMethod === 'BANK' ? t('order_detail.payment_method_bank') : t('order_detail.payment_method_cod')}
                                    </p>
                                    {selectedOrder.paymentMethod === 'BANK' &&

                                        <Badge className={paymentStatusConfig.color} variant="secondary">
                                            <PaymentStatusIcon className="w-3 h-3 mr-1" />
                                            {paymentStatusConfig.label}
                                        </Badge>
                                    }
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Timeline */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Lịch sử đơn hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {selectedOrder.status === 'delivered' && (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Đã giao hàng</p>
                                                <p className="text-xs text-gray-500">18/01/2024 - 14:30</p>
                                            </div>
                                        </div>
                                    )}
                                    {(selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped') && (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Đang vận chuyển</p>
                                                <p className="text-xs text-gray-500">17/01/2024 - 09:15</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Đang xử lý</p>
                                            <p className="text-xs text-gray-500">16/01/2024 - 10:20</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Đã đặt hàng</p>
                                            <p className="text-xs text-gray-500">15/01/2024 - 16:45</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailModal;