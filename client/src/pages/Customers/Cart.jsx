import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { address } from '../../services/Customer/ApiAuth';

const Cart = () => {
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.customer.accessToken);
    const decoded = jwtDecode(accessToken);
    const username = decoded.username;
    const reduxCartItems = useSelector((state) =>
        username ? state.cart.items[username] || [] : []
    );
    const [cartItems, setCartItems] = useState(reduxCartItems);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const getAddress = async () => {
        try {
            const res = await address();
            if (res.data && res.data.code === 200) {
                setAddresses(res.data.address)
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
            setSelectedAddress(defaultAddress.id);
        }
        getAddress()
    }, [addresses]);

    useEffect(() => {
        setCartItems(reduxCartItems);
    }, [reduxCartItems]);

    // Calculate total price of selected items
    const totalPrice = cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0);

    // Handle select all checkbox
    const handleSelectAll = () => {
        const allSelected = cartItems.every(item => item.selected);
        setCartItems(cartItems.map(item => ({ ...item, selected: !allSelected })));
    };

    // Handle delete all selected items
    const handleDeleteAll = () => {
        setCartItems(cartItems.filter(item => !item.selected));
    };

    // Handle individual checkbox change
    const toggleItemSelection = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    // Handle quantity increase
    const increaseQuantity = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    // Handle quantity decrease
    const decreaseQuantity = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    // Handle item removal
    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Handle address selection
    const handleAddressSelection = (id) => {
        setSelectedAddress(id);
    };

    // Handle checkout
    const handleCheckout = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        if (selectedItems.length > 0 && selectedAddress !== null) {
            navigate('/checkout', { state: { selectedItems, selectedAddress: addresses.find(addr => addr.id === selectedAddress) } });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
            {/* Header Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-6">
                        Giỏ Hàng Của Bạn
                    </h1>
                    <p className="text-lg text-gray-600 text-center mb-8">
                        Chọn các sản phẩm và địa chỉ giao hàng để thanh toán
                    </p>
                </div>
            </section>

            {/* Cart Items Section */}
            <section className="py-16 bg-white/50">
                <div className="container mx-auto px-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center">
                            <p className="text-xl text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
                            <Button
                                onClick={() => navigate('/products')}
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-lg px-8 py-3"
                            >
                                Tiếp Tục Mua Sắm
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Select All and Delete All */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={cartItems.every(item => item.selected)}
                                        onChange={handleSelectAll}
                                        className="h-5 w-5 text-green-600 mr-2 rounded"
                                    />
                                    <span className="text-gray-800 font-semibold">Chọn tất cả</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={handleDeleteAll}
                                    disabled={!cartItems.some(item => item.selected)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-5 w-5 mr-1" />
                                    Xóa các mục đã chọn
                                </Button>
                            </div>
                            {/* Cart Items */}
                            {cartItems.map((item) => (
                                <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="flex items-center p-6">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleItemSelection(item.id)}
                                            className="h-5 w-5 text-green-600 mr-4 rounded"
                                        />
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-16 w-16 object-contain mr-4"
                                        />
                                        <div className="flex-1 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                                <p className="text-gray-600">{item.price.toLocaleString('vi-VN')}đ / đơn vị</p>
                                                <div className="flex items-center mt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => decreaseQuantity(item.id)}
                                                        className="p-1"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="mx-3 text-gray-800">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => increaseQuantity(item.id)}
                                                        className="p-1"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-lg font-bold text-green-600 mr-4">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {/* Shipping Address Section */}
                            <Card className="mt-8">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-gray-800">
                                        Địa Chỉ Giao Hàng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {addresses.map((address) => (
                                        <div key={address.id} className="flex items-center mb-4">
                                            <input
                                                type="radio"
                                                name="shipping-address"
                                                checked={selectedAddress === address.id}
                                                onChange={() => handleAddressSelection(address.id)}
                                                className="h-5 w-5 text-green-600 mr-4"
                                            />
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">{address.label}</p>
                                                <p className="text-gray-600">{address.details}</p>
                                                <p className="text-gray-600">SĐT: {address.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        className="mt-4 text-green-600 hover:text-green-700"
                                        onClick={() => navigate('/add-address')}
                                    >
                                        Thêm Địa Chỉ Mới
                                    </Button>
                                </CardContent>
                            </Card>
                            {/* Total Price */}
                            <Card className="mt-8">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-gray-800">
                                        Tổng Cộng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg text-gray-600">Tổng tiền (đã chọn):</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {totalPrice.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full mt-6 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-lg"
                                        onClick={handleCheckout}
                                        disabled={cartItems.filter(item => item.selected).length === 0 || selectedAddress === null}
                                    >
                                        Thanh Toán
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-amber-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Tiếp Tục Mua Sắm Với NutiGo
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Khám phá thêm các sản phẩm hạt dinh dưỡng chất lượng cao
                    </p>
                    <Link to="/products">
                        <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                            Xem Tất Cả Sản Phẩm
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Cart;