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
import { getUserDiscounts, useUserDiscount } from '../../services/Customer/ApiUserDiscount';
import { Input } from '@/components/ui/input';

const CheckoutDemo = () => {
    const navigate = useNavigate();
    const [orderNote, setOrderNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isProcessing, setIsProcessing] = useState(false);
    const location = useLocation();
    const { selectedItems, selectedAddress } = location.state || {};
    const accessToken = useSelector((state) => state.customer.accessToken);
    const dispatch = useDispatch();
    const [discountCode, setDiscountCode] = useState('');   
    const [appliedDiscounts, setAppliedDiscounts] = useState([]);
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
    const [userDiscounts, setUserDiscounts] = useState([]);
    const [showAvailableDiscounts, setShowAvailableDiscounts] = useState(false);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);
    const [isApplyingAll, setIsApplyingAll] = useState(false);
    const { t } = useTranslation(['translation']);

    useEffect(() => {
        if (!selectedItems || !selectedAddress) {
            navigate('/cart');
        }
    }, [selectedItems, selectedAddress, navigate]);

    useEffect(() => {
        const fetchUserDiscounts = async () => {
            try {
                const res = await getUserDiscounts();
                console.log('User discounts response:', res);
                if (res.data && res.data.data && res.data.data.length > 0) {
                    // Extract discounts from the first user's discounts array
                    const userDiscounts = res.data.data[0].discounts || [];
                    setUserDiscounts(userDiscounts);
                }
            } catch (error) {
                console.error('Error fetching user discounts:', error);
            }
        };
        fetchUserDiscounts();
    }, []);

    const handleUseDiscount = async () => {
        if (!discountCode.trim()) {
            toast.error(t('checkout.enter_discount_code'));
            return;
        }

        // Check if discount already applied
        const isAlreadyApplied = appliedDiscounts.some(discount => 
            discount.discount.code === discountCode.trim()
        );
        if (isAlreadyApplied) {
            toast.error('Mã giảm giá này đã được áp dụng');
            return;
        }

        // Check if order meets minimum value for any available discount
        const matchingDiscount = userDiscounts.find(discount => 
            discount.discount.code === discountCode.trim()
        );
        
        if (matchingDiscount && subtotal < matchingDiscount.discount.minOrderValue) {
            toast.error(`Đơn hàng cần tối thiểu ${matchingDiscount.discount.minOrderValue.toLocaleString('vi-VN')}đ để sử dụng mã này`);
            return;
        }

        setIsApplyingDiscount(true);
        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const res = await useUserDiscount(discountCode);
            if (res.data && res.data.code === 200) {
                setAppliedDiscounts(prev => [...prev, res.data.data]);
                toast.success(t('checkout.discount_applied'));
                setDiscountCode('');
                
                // Refresh user discounts to update quantities
                const refreshRes = await getUserDiscounts();
                if (refreshRes.data && refreshRes.data.data && refreshRes.data.data.length > 0) {
                    const updatedUserDiscounts = refreshRes.data.data[0].discounts || [];
                    setUserDiscounts(updatedUserDiscounts);
                }
            } else {
                toast.error(res.data?.message || t('checkout.discount_error'));
            }
        } catch (error) {
            console.error('Error applying discount:', error);
            toast.error(t('checkout.discount_error'));
        } finally {
            setIsApplyingDiscount(false);
        }
    };

    const handleRemoveDiscount = (discountToRemove) => {
        setAppliedDiscounts(prev => prev.filter(discount => 
            discount.discount.code !== discountToRemove.discount.code
        ));
        toast.success(t('checkout.discount_removed'));
    };

    const handleSelectDiscount = (discount) => {
        setSelectedDiscounts(prev => {
            const isSelected = prev.some(d => d.discount.code === discount.discount.code);
            if (isSelected) {
                return prev.filter(d => d.discount.code !== discount.discount.code);
            } else {
                return [...prev, discount];
            }
        });
    };

    const handleApplyAllSelected = async () => {
        if (selectedDiscounts.length === 0) {
            toast.error('Vui lòng chọn ít nhất một mã giảm giá');
            return;
        }

        setIsApplyingAll(true);
        try {
            const promises = selectedDiscounts.map(discount => 
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useUserDiscount(discount.discount.code)
            );
            
            const results = await Promise.all(promises);
            const successfulDiscounts = [];
            
            results.forEach((res, index) => {
                if (res.data && res.data.code === 200) {
                    successfulDiscounts.push(res.data.data);
                } else {
                    toast.error(`Không thể áp dụng mã ${selectedDiscounts[index].discount.code}`);
                }
            });

            if (successfulDiscounts.length > 0) {
                setAppliedDiscounts(prev => [...prev, ...successfulDiscounts]);
                toast.success(`Đã áp dụng ${successfulDiscounts.length} mã giảm giá`);
                setSelectedDiscounts([]);
                
                // Refresh user discounts
                const refreshRes = await getUserDiscounts();
                if (refreshRes.data && refreshRes.data.data && refreshRes.data.data.length > 0) {
                    const updatedUserDiscounts = refreshRes.data.data[0].discounts || [];
                    setUserDiscounts(updatedUserDiscounts);
                }
            }
        } catch (error) {
            console.error('Error applying all discounts:', error);
            toast.error('Có lỗi xảy ra khi áp dụng mã giảm giá');
        } finally {
            setIsApplyingAll(false);
        }
    };

    const subtotal = selectedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );


    
    // Calculate total discount amount from all applied discounts
    const totalDiscountAmount = appliedDiscounts.reduce((total, discount) => {
        const discountAmount = subtotal * discount.discount.discountValue / 100;
        // Apply max discount limit if exists
        const maxDiscount = discount.discount.maxDiscount || Infinity;
        return total + Math.min(discountAmount, maxDiscount);
    }, 0);
    
    // Calculate preview discount for selected discounts (not yet applied)
    const previewDiscountAmount = selectedDiscounts.reduce((total, discount) => {
        const discountAmount = subtotal * discount.discount.discountValue / 100;
        const maxDiscount = discount.discount.maxDiscount || Infinity;
        return total + Math.min(discountAmount, maxDiscount);
    }, 0);
    
    // Total includes both applied and preview discounts
    const total = subtotal - totalDiscountAmount - previewDiscountAmount;


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
            // Include applied discounts in order data
            const discountIds = appliedDiscounts.map(discount => discount.discount._id);
            const res = await userOrder(items, dataShipping, paymentMethod, orderNote, discountIds);
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
                console.log(payRes.data);

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
                        {/* Mã giảm giá */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle>{t('checkout.discount')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {appliedDiscounts.length > 0 ? (
                                    <div className="space-y-3">
                                                                                    {appliedDiscounts.map((appliedDiscount, index) => {
                                                const discountAmount = subtotal * appliedDiscount.discount.discountValue / 100;
                                                const maxDiscount = appliedDiscount.discount.maxDiscount || Infinity;
                                                const finalDiscountAmount = Math.min(discountAmount, maxDiscount);
                                                
                                                return (
                                                    <div key={`${appliedDiscount.discount.code}-${index}`} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-green-800">
                                                                {appliedDiscount.discount.description}
                                                            </p>
                                                            <p className="text-sm text-green-600">
                                                                Giảm {appliedDiscount.discount.discountValue}% - {finalDiscountAmount.toLocaleString('vi-VN')}đ
                                                            </p>
                                                            <p className="text-xs text-green-500">
                                                                Mã: {appliedDiscount.discount.code}
                                                            </p>
                                                        </div>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleRemoveDiscount(appliedDiscount)}
                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                        >
                                                            {t('checkout.remove')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Input
                                                placeholder={t('checkout.discount_code')}
                                                value={discountCode}
                                                onChange={(e) => setDiscountCode(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleUseDiscount()}
                                                disabled={isApplyingDiscount}
                                            />
                                            <Button 
                                                onClick={handleUseDiscount}
                                                disabled={isApplyingDiscount || !discountCode.trim()}
                                                className="min-w-[120px]"
                                            >
                                                {isApplyingDiscount ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        <span>{t('checkout.applying')}</span>
                                                    </div>
                                                ) : (
                                                    t('checkout.use_discount')
                                                )}
                                            </Button>
                                        </div>
                                        {userDiscounts.length > 0 && (
                                            <div className="mt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowAvailableDiscounts(!showAvailableDiscounts)}
                                                    className="w-full flex items-center justify-between text-sm"
                                                >
                                                    <span>{t('checkout.available_discounts')} ({userDiscounts.length})</span>
                                                    <span className={`transform transition-transform ${showAvailableDiscounts ? 'rotate-180' : ''}`}>
                                                        ▼
                                                    </span>
                                                </Button>
                                                
                                                {showAvailableDiscounts && (
                                                    <div className="mt-3 space-y-3 max-h-64 overflow-y-auto">
                                                                                                            {userDiscounts.map((userDiscount, index) => (
                                                        <div 
                                                            key={`${userDiscount._id}-${index}`}
                                                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                        >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex-1">
                                                                        <h4 className="font-semibold text-gray-800 text-sm">
                                                                            {userDiscount.discount.description}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            Mã: <span className="font-mono bg-gray-200 px-1 rounded">{userDiscount.discount.code}</span>
                                                                        </p>
                                                                    </div>
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {userDiscount.discount.discountValue}%
                                                                    </Badge>
                                                                </div>
                                                                
                                                                                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-gray-700">Chọn mã này</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {userDiscount.discount.discountValue}%
                                                        </Badge>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDiscounts.some(d => d.discount.code === userDiscount.discount.code)}
                                                        onChange={() => handleSelectDiscount(userDiscount)}
                                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Giảm giá:</span> {userDiscount.discount.discountValue}%
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Còn lại:</span> {userDiscount.quantity_available} lượt
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Giá tối thiểu:</span> {userDiscount.discount.minOrderValue.toLocaleString('vi-VN')}đ
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Giảm tối đa:</span> {userDiscount.discount.maxDiscount.toLocaleString('vi-VN')}đ
                                                    </div>
                                                </div>
                                                
                                                {/* Check if current order meets minimum value */}
                                                {subtotal < userDiscount.discount.minOrderValue && (
                                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                                        ⚠️ Cần đặt hàng tối thiểu {userDiscount.discount.minOrderValue.toLocaleString('vi-VN')}đ để sử dụng mã này
                                                    </div>
                                                )}
                                                                
                                                                <div className="mt-2 text-xs text-gray-500">
                                                                    <span className="font-medium">Hạn sử dụng:</span> {new Date(userDiscount.expired_at).toLocaleDateString('vi-VN')}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Apply All Selected Button */}
                                                {selectedDiscounts.length > 0 && (
                                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-blue-800">
                                                                Đã chọn {selectedDiscounts.length} mã giảm giá
                                                            </span>
                                                            <span className="text-sm text-blue-600">
                                                                Giảm thêm: {previewDiscountAmount.toLocaleString('vi-VN')}đ
                                                            </span>
                                                        </div>
                                                        <Button
                                                            onClick={handleApplyAllSelected}
                                                            disabled={isApplyingAll}
                                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                            size="sm"
                                                        >
                                                            {isApplyingAll ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                    <span>Đang áp dụng...</span>
                                                                </div>
                                                            ) : (
                                                                `Áp dụng ${selectedDiscounts.length} mã giảm giá`
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
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
                                    
                                    {/* Applied Discounts */}
                                    {appliedDiscounts.length > 0 && (
                                        <>
                                            {appliedDiscounts.map((appliedDiscount, index) => {
                                                const discountAmount = subtotal * appliedDiscount.discount.discountValue / 100;
                                                const maxDiscount = appliedDiscount.discount.maxDiscount || Infinity;
                                                const finalDiscountAmount = Math.min(discountAmount, maxDiscount);
                                                
                                                return (
                                                    <div key={`${appliedDiscount.discount.code}-${index}`} className="flex justify-between text-green-600">
                                                        <span>{t('checkout.discount')} ({appliedDiscount.discount.discountValue}%):</span>
                                                        <span>-{finalDiscountAmount.toLocaleString('vi-VN')}đ</span>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                    
                                    {/* Preview Selected Discounts */}
                                    {selectedDiscounts.length > 0 && (
                                        <>
                                            {selectedDiscounts.map((selectedDiscount, index) => {
                                                const discountAmount = subtotal * selectedDiscount.discount.discountValue / 100;
                                                const maxDiscount = selectedDiscount.discount.maxDiscount || Infinity;
                                                const finalDiscountAmount = Math.min(discountAmount, maxDiscount);
                                                
                                                return (
                                                    <div key={`preview-${selectedDiscount.discount.code}-${index}`} className="flex justify-between text-blue-600">
                                                        <span>{t('checkout.discount')} ({selectedDiscount.discount.discountValue}%) - Chờ áp dụng:</span>
                                                        <span>-{finalDiscountAmount.toLocaleString('vi-VN')}đ</span>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                    
                                    {(appliedDiscounts.length > 0 || selectedDiscounts.length > 0) && (
                                        <Separator />
                                    )}

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
