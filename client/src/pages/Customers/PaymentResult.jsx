import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Package, Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { returnVnpay } from '../../services/Customer/vnPay';
import { getOrderById } from '../../services/Customer/ApiProduct';


export default function PaymentResult() {
    const { t } = useTranslation(['translation']);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('vnp_TxnRef');
    const [order, setOrder] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPaymentStatus = async () => {
        try {
            setIsLoading(true);
            const params = Object.fromEntries(searchParams.entries());

            // Call vnpay_return API to validate payment
            const res = await returnVnpay(params);
            console.log(res);

            const { status } = res.data;

            setPaymentStatus({ status });

            if (status === 'SUCCESS') {
                if (orderId) {
                    const orderRes = await getOrderById(orderId);
                    if (orderRes.data && orderRes.data.code === 200) {
                        setOrder(orderRes.data.data);
                    } else {
                        toast.error(t('toast.order_fetch_failed'));
                    }
                }
            } else if (status === 'FAILED') {
                toast.error(t('toast.payment_failed'));
            } else {
                toast.error(t('toast.payment_error'));
            }
        } catch (error) {
            console.error('Error fetching payment status:', error);
            setPaymentStatus({
                status: 'ERROR',
                message: t('toast.payment_error_generic'),
            });
            toast.error(t('toast.payment_error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!orderId) {
            toast.error(t('toast.invalid_order_id'));
            navigate('/cart');
            return;
        }
        fetchPaymentStatus();
    }, [orderId, searchParams, navigate, t]);

    const getStatusConfig = () => {
        switch (paymentStatus?.status) {
            case 'SUCCESS':
                return {
                    icon: CheckCircle,
                    title: t('payment_result.success'),
                    subtitle: t('payment_result.success_subtitle'),
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                };
            case 'FAILED':
                return {
                    icon: XCircle,
                    title: t('payment_result.failed'),
                    subtitle: t('payment_result.failed_subtitle'),
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                };
            case 'ERROR':
                return {
                    icon: AlertCircle,
                    title: t('payment_result.error'),
                    subtitle: t('payment_result.error_subtitle'),
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                };
            default:
                return {
                    icon: AlertCircle,
                    title: t('payment_result.unknown'),
                    subtitle: t('payment_result.unknown_subtitle'),
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                };
        }
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;


    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Status Card */}
                <Card className={`text-center mb-6 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
                    <CardContent className="pt-8 pb-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center mb-4">
                                    <StatusIcon className={`w-16 h-16 ${statusConfig.color}`} />
                                </div>
                                <h1 className={`text-3xl font-bold mb-2 ${statusConfig.color}`}>
                                    {statusConfig.title}
                                </h1>
                                <p className="text-gray-600 text-lg">{statusConfig.subtitle}</p>
                                {orderId && (
                                    <p className="text-sm text-gray-500 mt-4">
                                        {t('payment_result.order_id')}: <span className="font-mono">{orderId}</span>
                                    </p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Order Details - Only show for successful payments */}
                {/* {paymentStatus?.status === 'SUCCESS' && order && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                {t('payment_result.order_details')}
                            </CardTitle>
                        </CardHeader> */}
                {/* <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {t('payment_result.quantity')}: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <p className="text-lg font-bold">{t('payment_result.total')}:</p>
                                <p className="text-xl font-bold text-emerald-600">
                                    {order.total.toLocaleString('vi-VN')}đ
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        {t('payment_result.payment_method')}: {order.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        {t('payment_result.date')}: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="font-medium mb-2">{t('payment_result.shipping_address')}:</h4>
                                <p className="text-sm text-gray-600">
                                    {order.address.street}, {order.address.ward}, {order.address.district}, {order.address.province}
                                </p>
                            </div>
                        </CardContent> */}
                {/* </Card>
                )} */}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('payment_result.back_to_home')}
                    </Button>

                    {paymentStatus?.status === 'SUCCESS' ? (
                        <Button onClick={() => navigate('/orders')}>
                            {t('payment_result.view_orders')}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => navigate('/cart')}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {paymentStatus?.status === 'FAILED'
                                ? t('payment_result.try_again')
                                : t('payment_result.back_to_cart')}
                        </Button>
                    )}
                </div>

                {/* Additional Info for Success */}
                {paymentStatus?.status === 'SUCCESS' && (
                    <Card className="mt-6 bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-blue-800 mb-2">{t('payment_result.important_info')}</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>{t('payment_result.info_processing')}</li>
                                <li>{t('payment_result.info_email')}</li>
                                <li>{t('payment_result.info_support')}</li>
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Help Section for Failed/Canceled Payments */}
                {(paymentStatus?.status === 'FAILED' || paymentStatus?.status === 'ERROR') && (
                    <Card className="mt-6 bg-gray-50 border-gray-200">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {paymentStatus?.status === 'ERROR'
                                    ? t('payment_result.support_title')
                                    : t('payment_result.error_reasons')}
                            </h3>
                            <ul className="text-sm text-gray-700 space-y-1">
                                {paymentStatus?.status === 'ERROR' ? (
                                    <>
                                        <li>{t('payment_result.support_contact')}</li>
                                        <li>{t('payment_result.support_alternative')}</li>
                                        <li>{t('payment_result.support_check_order')}</li>
                                    </>
                                ) : (
                                    <>
                                        <li>{t('payment_result.error_card_info')}</li>
                                        <li>{t('payment_result.error_balance')}</li>
                                        <li>{t('payment_result.error_network')}</li>
                                        <li>{t('payment_result.error_support')}</li>
                                    </>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div >
    );
}