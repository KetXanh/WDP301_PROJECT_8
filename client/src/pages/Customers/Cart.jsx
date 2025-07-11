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
import { useTranslation } from 'react-i18next';

const EMPTY_ARRAY = [];

const Cart = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('translation');
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
    const reduxCartItems = useSelector((state) => state.cart.items[username] ?? EMPTY_ARRAY, shallowEqual);
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
        isDefault: false,
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
        }
    };

    useEffect(() => {
        if (username === GUEST_ID) return;
        getAddress();
    }, [username]);

    useEffect(() => {
        const defaultAddr = addresses.find((a) => a.isDefault);
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
                setAddresses(addresses.filter((addr) => addr.id !== addressId));
                if (selectedAddress === addressId) {
                    const newDefault = addresses.find((addr) => addr.id !== addressId && addr.isDefault);
                    setSelectedAddress(newDefault ? newDefault.id : null);
                }
                await getAddress();
                toast.success(t('toast.delete_address_success'));
            } else {
                toast.error(t('toast.delete_address_fail'));
            }
        } catch (error) {
            console.error('Delete address failed:', error);
        }
    };

    // Calculate total price of selected items
    const totalPrice = cartItems
        .filter((item) => item.selected && item.stock >= 0)
        .reduce((total, item) => total + item.price * item.quantity, 0);

    // Handle select all checkbox
    const handleSelectAll = () => {
        const allSelected = cartItems.every((item) => item.selected || item.stock < 0);
        setCartItems(
            cartItems.map((item) => ({
                ...item,
                selected: item.stock < 0 ? false : !allSelected, // Không chọn nếu stock < 0
            }))
        );
    };

    // Handle delete all selected items
    const handleDeleteAll = async () => {
        const selectedProductIds = cartItems
            .filter((item) => item.selected && item.stock >= 0)
            .map((item) => item.productId);

        try {
            const res = await removeMultiItemToCart(selectedProductIds);
            if (res.data.code === 200) {
                selectedProductIds.forEach((id) => {
                    dispatch(removeFromCart({ userId: username, productId: id }));
                });
                toast.success(t('toast.remove_selected_success'));
            } else {
                toast.error(t('toast.remove_selected_fail'));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Handle individual checkbox change
    const toggleItemSelection = (id) => {
        setCartItems(
            cartItems.map((item) =>
                item.productId === id && item.stock >= 0
                    ? { ...item, selected: !item.selected }
                    : item
            )
        );
    };

    // Handle quantity increase
    const increaseQuantities = async (id) => {
        const item = cartItems.find((item) => item.productId === id);
        if (item.stock < 0) {
            toast.error(t('toast.productPaused')); // Thông báo nếu sản phẩm đã tạm dừng
            return;
        }
        try {
            const res = await increItemToCart(id);
            if (res.data.code === 200) {
                dispatch(increaseQuantity({ userId: username, productId: id }));
            } else if (res.data.code === 404) {
                dispatch(clearCart({ userId: username }));
                toast.error(t('toast.cart_deleted'));
            }
        } catch (error) {
            console.error('Increase failed:', error);
        }
    };

    // Handle quantity decrease
    const decreaseQuantities = async (id) => {
        const item = cartItems.find((item) => item.productId === id);
        if (item.stock < 0) {
            toast.error(t('toast.productPaused')); // Thông báo nếu sản phẩm đã tạm dừng
            return;
        }
        try {
            const res = await decreItemToCart(id);
            if (res.data.code === 200) {
                dispatch(decreaseQuantity({ userId: username, productId: id }));
            } else if (res.data.code === 404) {
                dispatch(clearCart({ userId: username }));
                toast.error(t('toast.cart_deleted'));
            }
        } catch (error) {
            console.error('Decrease failed:', error);
        }
    };

    // Handle item removal
    const removeItem = async (id) => {
        try {
            const res = await removeItemToCart(id);
            if (res.data.code === 200) {
                dispatch(removeFromCart({ userId: username, productId: id }));
                toast.success(t('toast.delete_product_success'));
            } else if (res.data.code === 404) {
                dispatch(clearCart({ userId: username }));
                toast.error(t('toast.cart_deleted'));
            }
        } catch (error) {
            console.error('Remove failed:', error);
        }
    };

    // Handle address selection
    const handleAddressSelection = (id) => {
        setSelectedAddress(id);
    };

    // Handle checkout
    const handleCheckout = () => {
        const selectedItems = cartItems.filter((item) => item.selected && item.stock >= 0);
        if (selectedItems.length > 0 && selectedAddress !== null) {
            navigate('/checkout', {
                state: {
                    selectedItems,
                    selectedAddress: addresses.find((addr) => addr.id === selectedAddress),
                },
            });
        } else {
            toast.error(t('toast.select_items_and_address'));
        }
    };

    // Handle input change for new address
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle isDefault change
    const handleIsDefaultChange = (value) => {
        setNewAddress((prev) => ({
            ...prev,
            isDefault: value === 'true',
        }));
    };

    // Handle add new address
    const handleAddAddress = async () => {
        if (
            newAddress.fullname &&
            newAddress.street &&
            newAddress.ward &&
            newAddress.district &&
            newAddress.province &&
            newAddress.phone
        ) {
            try {
                const res = await addNewAddress({
                    fullName: newAddress.fullname,
                    phone: newAddress.phone,
                    street: newAddress.street,
                    ward: newAddress.ward,
                    district: newAddress.district,
                    province: newAddress.province,
                    label: newAddress.label || 'Nhà riêng',
                    isDefault: newAddress.isDefault,
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
                        isDefault: false,
                    });
                    setIsAddressDialogOpen(false);
                    setSelectedAddress(res.data.address._id);
                    await getAddress();
                    toast.success(t('toast.add_address_success'));
                } else {
                    toast.error(t('toast.add_address_fail'));
                }
            } catch (error) {
                console.error('Add address failed:', error);
            }
        } else {
            toast.error(t('toast.missing_address_fields'));
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md mx-auto px-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full opacity-20"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('cart.empty_title')}</h1>
                    <p className="text-gray-600 text-lg">{t('cart.empty_message')}</p>
                    <Button
                        onClick={() => navigate('/products')}
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg font-semibold"
                    >
                        {t('cart.explore_products')}
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
                            <h1 className="text-3xl font-bold text-gray-800">{t('cart.title')}</h1>
                            <p className="text-gray-600 mt-1">
                                {cartItems.length} {t('cart.items_count')}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/products')}
                            className="hidden md:flex"
                        >
                            {t('cart.continue_shopping')}
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
                                            checked={cartItems.every((item) => item.selected || item.stock < 0)}
                                            onChange={handleSelectAll}
                                            className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                        />
                                        <span className="text-gray-800 font-medium">
                                            {t('cart.select_all')} ({cartItems.length})
                                        </span>
                                    </label>
                                    <Button
                                        variant="ghost"
                                        onClick={handleDeleteAll}
                                        disabled={!cartItems.some((item) => item.selected && item.stock >= 0)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t('cart.delete_selected')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <Card
                                    key={item.productId}
                                    className="shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <input
                                                type="checkbox"
                                                checked={item.selected}
                                                onChange={() => toggleItemSelection(item.productId)}
                                                className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 mt-1"
                                                disabled={item.stock < 0}
                                            />
                                            <Link
                                                to={`/products/${item.slug}`}
                                                className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden"
                                            >
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />

                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <Link to={`/products/${item.slug}`}>
                                                            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-emerald-600">
                                                                {item.name}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-emerald-600 font-medium mb-3">
                                                            {item.price.toLocaleString('vi-VN')}đ
                                                        </p>
                                                        <p className="text-red-600 mb-3">
                                                            {item.stock < 0 &&
                                                                t('toast.productPaused')
                                                            }
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center border rounded-lg bg-gray-50">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => decreaseQuantities(item.productId)}
                                                                    className="h-10 w-10 p-0 hover:bg-gray-200"
                                                                    disabled={item.quantity <= 1 || item.stock < 0}
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
                                                                    disabled={item.stock < 0}
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
                                    {t('cart.shipping_address')}
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
                                                <p className="text-gray-600">
                                                    {address.fullName} - {address.details}
                                                </p>
                                                <p className="text-gray-600">{t('cart.phone')}: {address.phone}</p>
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
                                    {username === "guest" ? (
                                        <Button
                                            variant="outline"
                                            className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                                            onClick={() => toast.error(t('toast.login_required'))}
                                        >
                                            + {t('cart.add_new_address')}
                                        </Button>
                                    ) : (
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                                            >
                                                + {t('cart.add_new_address')}
                                            </Button>
                                        </DialogTrigger>
                                    )}
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>{t('cart.add_new_address')}</DialogTitle>
                                            <DialogDescription>{t('cart.add_address_description')}</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="fullname">{t('cart.receiver_name')}</Label>
                                                <Input
                                                    id="fullname"
                                                    name="fullname"
                                                    placeholder={t('cart.receiver_name')}
                                                    value={newAddress.fullname}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="label">{t('cart.address_label')}</Label>
                                                <Input
                                                    id="label"
                                                    name="label"
                                                    placeholder={t('cart.label')}
                                                    value={newAddress.label}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="street">{t('cart.street')}</Label>
                                                <Input
                                                    id="street"
                                                    name="street"
                                                    placeholder={t('cart.street')}
                                                    value={newAddress.street}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="ward">{t('cart.ward')}</Label>
                                                <Input
                                                    id="ward"
                                                    name="ward"
                                                    placeholder={t('cart.ward')}
                                                    value={newAddress.ward}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="district">{t('cart.district')}</Label>
                                                <Input
                                                    id="district"
                                                    name="district"
                                                    placeholder={t('cart.district')}
                                                    value={newAddress.district}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="province">{t('cart.province')}</Label>
                                                <Input
                                                    id="province"
                                                    name="province"
                                                    placeholder={t('cart.province')}
                                                    value={newAddress.province}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">{t('cart.phone')}</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    placeholder={t('cart.phone')}
                                                    value={newAddress.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>{t('cart.set_default')}</Label>
                                                <RadioGroup
                                                    value={newAddress.isDefault.toString()}
                                                    onValueChange={handleIsDefaultChange}
                                                    className="flex space-x-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="true" id="isDefaultTrue" />
                                                        <Label htmlFor="isDefaultTrue">{t('cart.yes')}</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="false" id="isDefaultFalse" />
                                                        <Label htmlFor="isDefaultFalse">{t('cart.no')}</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
                                                {t('cart.cancel')}
                                            </Button>
                                            <Button onClick={handleAddAddress}>{t('cart.add_new_address')}</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card className="shadow-sm sticky top-4">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold text-gray-800">
                                    {t('cart.order_summary')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('cart.items_selected')}</span>
                                        <span>{cartItems.filter((item) => item.selected && item.stock >= 0).length}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{t('cart.subtotal')}</span>
                                        <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-800">{t('cart.total')}</span>
                                        <span className="text-2xl font-bold text-emerald-600">
                                            {totalPrice.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg font-semibold"
                                    onClick={() => {
                                        if (username === 'guest') {
                                            toast.error(t('toast.login_required'));
                                            return;
                                        }
                                        handleCheckout()
                                    }}
                                    disabled={
                                        username === "guest" ||
                                        cartItems.filter((item) => item.selected && item.stock >= 0).length === 0 ||
                                        selectedAddress === null
                                    }
                                >
                                    {t('cart.checkout')}
                                </Button>
                                <p className="text-xs text-gray-500 text-center">{t('cart.agree_terms')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">{t('cart.discover_more')}</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        {t('cart.discover_message')}
                    </p>
                    <Link to="/products">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="text-lg px-8 py-3 bg-white text-emerald-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {t('cart.view_all_products')}
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Cart;