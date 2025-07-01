import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from '../../store/customer/cartSlice';
import { GUEST_ID } from '../../store/customer/constans';
import { addNewAddress, address, decreItemToCart, increItemToCart, removeItemToCart, removeMultiItemToCart, deleteAddress } from '../../services/Customer/ApiProduct';
import { toast } from 'react-toastify';

const EMPTY_ARRAY = [];

const Cart = () => {
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.customer.accessToken);
    const username = useMemo(() => {
        if (typeof accessToken !== 'string' || !accessToken.trim()) return GUEST_ID;

        try {
            const decoded = jwtDecode(accessToken);
            return decoded.username || GUEST_ID;
        } catch {
            return GUEST_ID;
        }
    }, [accessToken]);
    const reduxCartItems = useSelector(
        (state) => state.cart.items[username] ?? EMPTY_ARRAY,
        shallowEqual
    );
    const [cartItems, setCartItems] = useState(reduxCartItems);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullname: '',
        label: '',
        street: '',
        ward: '',
        district: '',
        province: '',
        phone: '',
        isDefault: false
    });
    const dispatch = useDispatch();

    const getAddress = async () => {
        try {
            const res = await address();
            if (res.data && res.data.code === 200) {
                setAddresses(res.data.address);
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi khi lấy danh sách địa chỉ");
        }
    };

    useEffect(() => {
        if (username === GUEST_ID) return;
        getAddress();
    }, [username]);

    useEffect(() => {
        const defaultAddr = addresses.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
    }, [addresses]);

    useEffect(() => {
        setCartItems(reduxCartItems);
    }, [reduxCartItems]);

    // Handle delete address
    const handleDeleteAddress = async (addressId) => {
        try {
            const res = await deleteAddress(addressId);
            if (res.data && res.data.code === 200) {
                setAddresses(addresses.filter(addr => addr.id !== addressId));
                if (selectedAddress === addressId) {
                    const newDefault = addresses.find(addr => addr.id !== addressId && addr.isDefault);
                    setSelectedAddress(newDefault ? newDefault.id : null);
                }
                await getAddress();
                toast.success("Xóa địa chỉ thành công");
            } else {
                toast.error(res.data.message || "Xóa địa chỉ thất bại");
            }
        } catch (error) {
            console.error("Delete address failed:", error);
            toast.error("Lỗi khi xóa địa chỉ");
        }
    };

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
    const handleDeleteAll = async () => {
        const selectedProductIds = cartItems.filter(item => item.selected).map(item => item.productId);

        try {
            const res = await removeMultiItemToCart(selectedProductIds);
            if (res.data.code === 200) {
                selectedProductIds.forEach(id => {
                    dispatch(removeFromCart({ userId: username, productId: id }));
                });
                toast.success("Xóa thành công các sản phẩm đã chọn");
            } else {
                toast.error("Xóa thất bại");
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi kết nối đến server");
        }
    };

    // Handle individual checkbox change
    const toggleItemSelection = (id) => {
        setCartItems(cartItems.map(item =>
            item.productId === id ? { ...item, selected: !item.selected } : item
        ));
    };

    // Handle quantity increase
    const increaseQuantities = async (id) => {
        try {
            const res = await increItemToCart(id);
            if (res.data.code === 200) {
                dispatch(increaseQuantity({ userId: username, productId: id }));
            } else if (res.data.code === 404) {
                dispatch(clearCart({ userId: username }));
                toast.error("Giỏ hàng đã bị xoá, vui lòng tải lại");
            }
        } catch (error) {
            console.error("Increase failed:", error);
            toast.error("Lỗi khi tăng số lượng");
        }
    };

    // Handle quantity decrease
    const decreaseQuantities = async (id) => {
        try {
            const res = await decreItemToCart(id);
            if (res.data.code === 200) {
                dispatch(decreaseQuantity({ userId: username, productId: id }));
            } else if (res.data.code === 404) {
                dispatch(clearCart({ userId: username }));
                toast.error("Giỏ hàng đã bị xoá, vui lòng tải lại");
            }
        } catch (error) {
            console.error("Decrease failed:", error);
            toast.error("Lỗi khi giảm số lượng");
        }
    };

    // Handle item removal
    const removeItem = async (id) => {
        try {
            const res = await removeItemToCart(id);
            if (res.data.code === 200) {
                dispatch(removeFromCart({ userId: username, productId: id }));
                toast.success("Xóa sản phẩm thành công");
            } else if (res.data.code === 404) {
                dispatch(clearCart({ userId: username }));
                toast.error("Giỏ hàng đã bị xoá, vui lòng tải lại");
            }
        } catch (error) {
            console.error("Remove failed:", error);
            toast.error("Lỗi khi xóa sản phẩm");
        }
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
        } else {
            toast.error("Vui lòng chọn sản phẩm và địa chỉ giao hàng");
        }
    };

    // Handle input change for new address
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle isDefault change
    const handleIsDefaultChange = (value) => {
        setNewAddress(prev => ({
            ...prev,
            isDefault: value === 'true'
        }));
    };

    // Handle add new address
    const handleAddAddress = async () => {
        if (newAddress.fullname && newAddress.street && newAddress.ward && newAddress.district && newAddress.province && newAddress.phone) {
            try {
                const res = await addNewAddress({
                    fullName: newAddress.fullname,
                    phone: newAddress.phone,
                    street: newAddress.street,
                    ward: newAddress.ward,
                    district: newAddress.district,
                    province: newAddress.province,
                    label: newAddress.label || 'Nhà riêng',
                    isDefault: newAddress.isDefault
                });

                if (res.data && res.data.code === 200) {
                    setAddresses([...addresses, { ...res.data.address, id: res.data.address._id }]);
                    setNewAddress({
                        fullname: '',
                        label: '',
                        street: '',
                        ward: '',
                        district: '',
                        province: '',
                        phone: '',
                        isDefault: false
                    });
                    setIsAddressDialogOpen(false);
                    setSelectedAddress(res.data.address._id);
                    await getAddress();
                    toast.success("Thêm địa chỉ thành công");
                } else {
                    toast.error(res.data.message || "Thêm địa chỉ thất bại");
                }
            } catch (error) {
                console.error("Add address failed:", error);
                toast.error("Lỗi khi thêm địa chỉ");
            }
        } else {
            toast.error("Vui lòng điền đầy đủ thông tin địa chỉ");
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md mx-auto px-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full opacity-20"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng trống</h1>
                    <p className="text-gray-600 text-lg">Hãy thêm một số sản phẩm tuyệt vời vào giỏ hàng của bạn!</p>
                    <Button
                        onClick={() => navigate('/products')}
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg font-semibold"
                    >
                        Khám Phá Sản Phẩm
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Giỏ Hàng</h1>
                            <p className="text-gray-600 mt-1">{cartItems.length} sản phẩm</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/products')}
                            className="hidden md:flex"
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Select All Controls */}
                        <Card className="shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={cartItems.every(item => item.selected)}
                                            onChange={handleSelectAll}
                                            className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                        />
                                        <span className="text-gray-800 font-medium">Chọn tất cả ({cartItems.length})</span>
                                    </label>
                                    <Button
                                        variant="ghost"
                                        onClick={handleDeleteAll}
                                        disabled={!cartItems.some(item => item.selected)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Xóa đã chọn
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.productId} className="shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <input
                                                type="checkbox"
                                                checked={item.selected}
                                                onChange={() => toggleItemSelection(item.productId)}
                                                className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 mt-1"
                                            />
                                            <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-emerald-600 font-medium mb-3">
                                                            {item.price.toLocaleString('vi-VN')}đ
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center border rounded-lg bg-gray-50">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => decreaseQuantities(item.productId)}
                                                                    className="h-10 w-10 p-0 hover:bg-gray-200"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                                                                    {item.quantity}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => increaseQuantities(item.productId)}
                                                                    className="h-10 w-10 p-0 hover:bg-gray-200"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xl font-bold text-gray-800">
                                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(item.productId)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                                    Địa Chỉ Giao Hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {addresses.map((address) => (
                                    <div key={address.id} className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="shipping-address"
                                                checked={selectedAddress === address.id}
                                                onChange={() => handleAddressSelection(address.id)}
                                                className="h-5 w-5 text-green-600 mr-4"
                                            />
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">{address.label}</p>
                                                <p className="text-gray-600">{address.fullName} - {address.details}</p>
                                                <p className="text-gray-600">Số điện thoại: {address.phone}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ))}
                                <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                                        >
                                            + Thêm Địa Chỉ Mới
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Thêm Địa Chỉ Mới</DialogTitle>
                                            <DialogDescription>
                                                Nhập thông tin địa chỉ giao hàng mới của bạn.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="fullname">Tên người nhận</Label>
                                                <Input
                                                    id="fullname"
                                                    name="fullname"
                                                    placeholder="Nhập tên người nhận"
                                                    value={newAddress.fullname}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="label">Loại địa chỉ</Label>
                                                <Input
                                                    id="label"
                                                    name="label"
                                                    placeholder="Nhà riêng, công ty, v.v..."
                                                    value={newAddress.label}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="street">Số nhà, tên đường</Label>
                                                <Input
                                                    id="street"
                                                    name="street"
                                                    placeholder="Số nhà, tên đường"
                                                    value={newAddress.street}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="ward">Phường/Xã</Label>
                                                <Input
                                                    id="ward"
                                                    name="ward"
                                                    placeholder="Phường/Xã"
                                                    value={newAddress.ward}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="district">Quận/Huyện</Label>
                                                <Input
                                                    id="district"
                                                    name="district"
                                                    placeholder="Quận/Huyện"
                                                    value={newAddress.district}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="province">Tỉnh/Thành phố</Label>
                                                <Input
                                                    id="province"
                                                    name="province"
                                                    placeholder="Tỉnh/Thành phố"
                                                    value={newAddress.province}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">Số điện thoại</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    placeholder="Nhập số điện thoại"
                                                    value={newAddress.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Đặt làm địa chỉ mặc định</Label>
                                                <RadioGroup
                                                    value={newAddress.isDefault.toString()}
                                                    onValueChange={handleIsDefaultChange}
                                                    className="flex space-x-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="true" id="isDefaultTrue" />
                                                        <Label htmlFor="isDefaultTrue">Có</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="false" id="isDefaultFalse" />
                                                        <Label htmlFor="isDefaultFalse">Không</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
                                                Hủy
                                            </Button>
                                            <Button onClick={handleAddAddress}>
                                                Thêm Địa Chỉ
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card className="shadow-sm sticky top-4">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold text-gray-800">
                                    Tóm Tắt Đơn Hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Sản phẩm đã chọn:</span>
                                        <span>{cartItems.filter(item => item.selected).length}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính:</span>
                                        <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                                        <span className="text-2xl font-bold text-emerald-600">
                                            {totalPrice.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg font-semibold"
                                    onClick={handleCheckout}
                                    disabled={cartItems.filter(item => item.selected).length === 0 || selectedAddress === null}
                                >
                                    Thanh Toán
                                </Button>
                                <p className="text-xs text-gray-500 text-center">
                                    Bằng cách thanh toán, bạn đồng ý với điều khoản sử dụng
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Khám Phá Thêm Sản Phẩm
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Những sản phẩm hạt dinh dưỡng chất lượng cao đang chờ bạn
                    </p>
                    <Link to="/products">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="text-lg px-8 py-3 bg-white text-emerald-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Xem Tất Cả Sản Phẩm
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Cart;