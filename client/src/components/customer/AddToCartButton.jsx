import React from 'react';
import { addToCart } from '../../store/customer/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { GUEST_ID } from '../../store/customer/constans';
import { jwtDecode } from 'jwt-decode';

const AddToCartButton = ({ product, quantity }) => {
    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.customer.accessToken);
    const username = React.useMemo(() => {
        if (typeof accessToken === 'string' && accessToken.trim()) {
            try {
                const decoded = jwtDecode(accessToken);
                return decoded.username || GUEST_ID;
            } catch {
                return GUEST_ID;
            }
        }
        return GUEST_ID;
    }, [accessToken]);
    const handleAddToCart = () => {
        if (!product.stock || product.stock < 1) {
            return toast.error("Sản phẩm đã hết hàng");
        }

        const itemPayload = {
            productId: product._id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            imageUrl: product.image,
            quantity: quantity,
            stock: product.stock,
        };

        dispatch(addToCart({ item: itemPayload, userId: username }));
        toast.success("Đã thêm vào giỏ");
    };

    return (
        <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
            disabled={!product.stock}
        >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
        </Button>
    );
};

export default AddToCartButton;