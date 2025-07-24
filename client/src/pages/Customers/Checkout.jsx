// CheckoutDemo.tsx
import React, { useState } from 'react';
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    Truck,
    Package,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { userOrder } from '../../services/Customer/ApiProduct';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { ROLE } from '../../constants';
import { useTranslation } from 'react-i18next';
import { createPaymentUrl } from '../../services/Customer/vnPay';
import i18n from '../../i18n/i18n';
import { removePurchasedItems } from '../../store/customer/cartSlice';


const CheckoutDemo = () => {
    const navigate = useNavigate();
    const [orderNote, setOrderNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isProcessing, setIsProcessing] = useState(false);
    const location = useLocation();
    const { selectedItems, selectedAddress } = location.state || {};
    const accessToken = useSelector((state) => state.customer.accessToken);
    const dispatch = useDispatch();

    const { t } = useTranslation(['translation']);

    useEffect(() => {
        if (!selectedItems || !selectedAddress) {
            navigate('/cart');
        }
    }, [selectedItems, selectedAddress, navigate]);


    const subtotal = selectedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );
    const total = subtotal;


    const handlePlaceOrder = async () => {
        try {
            const decoded = jwtDecode(accessToken);
            const userId = decoded.username;
            if (decoded && ROLE.includes(decoded.role)) {
                return toast.error(t("toast.no_permission"))
            }
            if (!accessToken) {
                toast.error(t("toast.please_login"))
                navigate('/login')
                return;
            }

            const items = selectedItems.map(i => ({
                product: i.productId,
                quantity: i.quantity
            }))
            const shippingAddress = selectedAddress.details.split(",").map(s => s.trim());
            const [street, ward, district, province] = shippingAddress;
            const dataShipping = {
                lable: selectedAddress.lable || "",
                fullName: selectedAddress.fullName,
                street,
                ward,
                district,
                province,
                phone: selectedAddress.phone,
            }
            const res = await userOrder(items, dataShipping, paymentMethod, orderNote);
            if (paymentMethod === "CASH") {
                if (res.data && res.data.code === 201) {
                    toast.success(t("toast.order_success"))
                    dispatch(removePurchasedItems({
                        userId,
                        purchasedIds: selectedItems.map(item => item.productId),
                    }))
                    navigate('/')
                } else if (res.data && res.data.code === 401) {
                    toast.error(t("toast.invalid_address"))
                }
                return setIsProcessing(false);
            } else {
                const order = res.data;
                const payRes = await createPaymentUrl(
                    {
                        orderId: order.orderId,
                        amount: order.totalAmount,
                        language: i18n.language === 'vi' ? 'vn' : 'en',
                    }
                );
                window.location.href = payRes.data;
            }
        } catch (error) {
            console.log(error);

        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Header mini */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={() => navigate('/cart')} className="p-2">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{t('checkout.title')}</h1>
                            <p className="text-gray-600 mt-1">{t('checkout.subtitle')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ------- Cột trái ------- */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Địa chỉ */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPin className="h-5 w-5 text-emerald-600" />
                                    <span>{t('checkout.shipping_address')}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800 mb-1">
                                                {selectedAddress.label}
                                            </p>
                                            <p className="text-gray-600 mb-2">
                                                {selectedAddress.fullName}-{selectedAddress.details}
                                            </p>
                                            <p className="text-gray-600">
                                                {t('cart.phone')}: {selectedAddress.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Phương thức thanh toán */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center space-x-2">
                                    <CreditCard className="h-5 w-5 text-emerald-600" />
                                    <span>{t('checkout.payment_method')}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(v) => setPaymentMethod(v)}
                                >
                                    {/* COD */}
                                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="CASH" id="cod" />
                                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Truck className="h-5 w-5 text-amber-600" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {t('checkout.cod_title')}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {t('checkout.cod_description')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-amber-100 text-amber-800"
                                                >
                                                    {t('checkout.popular')}
                                                </Badge>
                                            </div>
                                        </Label>
                                    </div>

                                    {/* BANK */}
                                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 mt-4">
                                        <RadioGroupItem value="BANK" id="bank" />
                                        <Label htmlFor="bank" className="flex-1 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {t('checkout.bank_title')}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {t('checkout.bank_description')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-blue-100 text-blue-800"
                                                >
                                                    {t('checkout.safe')}
                                                </Badge>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>

                            </CardContent>
                        </Card>

                        {/* Ghi chú */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle>{t('checkout.noteOrder')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder={t('checkout.noteCheckout')}
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* ------- Sidebar ------- */}
                    <div className="space-y-6">
                        {/* Danh sách món */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center space-x-2">
                                    <Package className="h-5 w-5 text-emerald-600" />
                                    <span>
                                        {t('checkout.noteOrder', { count: selectedItems.length })}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-60 overflow-y-auto space-y-3">
                                    {selectedItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                                    {item.name}
                                                </p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-gray-500">
                                                        {item.price.toLocaleString('vi-VN')}đ ×{' '}
                                                        {item.quantity}
                                                    </span>
                                                    <span className="font-medium text-emerald-600 text-sm">
                                                        {(item.price * item.quantity).toLocaleString(
                                                            'vi-VN'
                                                        )}
                                                        đ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tổng tiền */}
                        <Card className="shadow-sm sticky top-4">
                            <CardHeader className="pb-4">
                                <CardTitle>{t('checkout.order_total')}:</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('checkout.subtotal')}:</span>
                                        <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                                    </div>

                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-800">
                                            {t('checkout.total_payment')}:
                                        </span>
                                        <span className="text-2xl font-bold text-emerald-600">
                                            {total.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg font-semibold"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>{t('checkout.processing')}</span>
                                        </div>
                                    ) : (
                                        t('checkout.place_order')
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutDemo;
