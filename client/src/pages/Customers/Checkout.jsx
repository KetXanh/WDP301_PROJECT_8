// CheckoutDemo.tsx
import React, { useState } from 'react';
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    Truck,
    Package,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

// ======== DATA CỨNG ========
const mockAddress = {
    id: 1,
    label: 'Nhà riêng',
    details: '12 Ngõ 34, P. Dịch Vọng, Q. Cầu Giấy, Hà Nội',
    phone: '090 123 4567',
    isDefault: true,
};

const mockItems = [
    {
        id: 'v1',
        name: 'Hạt Macca Úc 250g',
        imageUrl: 'https://picsum.photos/seed/macca/120',
        price: 120_000,
        quantity: 2,
    },
    {
        id: 'v2',
        name: 'Hạt Óc Chó Mỹ 250g',
        imageUrl: 'https://picsum.photos/seed/walnut/120',
        price: 98_000,
        quantity: 1,
    },
];
// ======================================

const CheckoutDemo = () => {
    const navigate = useNavigate();

    const [selectedAddress, setSelectedAddress] = useState(mockAddress);
    const [orderNote, setOrderNote] = useState('');
    const [selectedItems] = useState(mockItems);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = selectedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );
    const shippingFee = 30_000;
    const total = subtotal + shippingFee;

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        setTimeout(() => {
            alert('Đặt hàng demo thành công!');
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Header mini */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Thanh Toán</h1>
                            <p className="text-gray-600 mt-1">Hoàn tất đơn hàng của bạn</p>
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
                                    <span>Địa Chỉ Giao Hàng</span>
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
                                                {selectedAddress.details}
                                            </p>
                                            <p className="text-gray-600">
                                                Số điện thoại: {selectedAddress.phone}
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
                                    <span>Phương Thức Thanh Toán</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(v) => setPaymentMethod(v)}
                                >
                                    {/* COD */}
                                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Truck className="h-5 w-5 text-amber-600" />
                                                    <div>
                                                        <p className="font-medium">
                                                            Thanh toán khi nhận hàng (COD)
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Bằng tiền mặt
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-amber-100 text-amber-800"
                                                >
                                                    Phổ biến
                                                </Badge>
                                            </div>
                                        </Label>
                                    </div>

                                    {/* BANK */}
                                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 mt-4">
                                        <RadioGroupItem value="bank" id="bank" />
                                        <Label htmlFor="bank" className="flex-1 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium">
                                                            Chuyển khoản ngân hàng
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Trả trước đơn hàng
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-blue-100 text-blue-800"
                                                >
                                                    An toàn
                                                </Badge>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {paymentMethod === 'bank' && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-medium text-blue-800 mb-2">
                                            Thông tin chuyển khoản:
                                        </h4>
                                        <div className="space-y-1 text-sm text-blue-700">
                                            <p>
                                                <strong>Ngân hàng:</strong> Vietcombank
                                            </p>
                                            <p>
                                                <strong>Số TK:</strong> 1234567890
                                            </p>
                                            <p>
                                                <strong>Chủ TK:</strong> CÔNG TY TNHH ABC
                                            </p>
                                            <p>
                                                <strong>Nội dung:</strong> Thanh toán đơn hàng + SĐT
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Ghi chú */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle>Ghi Chú Đơn Hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Nhập ghi chú (không bắt buộc)"
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
                                        Đơn Hàng ({selectedItems.length} sản phẩm)
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
                                <CardTitle>Tổng Cộng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính:</span>
                                        <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Phí vận chuyển:</span>
                                        <span>{shippingFee.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-800">
                                            Tổng thanh toán:
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
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : (
                                        'Đặt Hàng'
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
