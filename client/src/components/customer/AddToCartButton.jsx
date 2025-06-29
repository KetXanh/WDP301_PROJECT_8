import React from 'react';
import { addToCart } from '../../store/customer/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { GUEST_ID } from '../../store/customer/constans';
import { jwtDecode } from 'jwt-decode';
import { ROLE } from '../../constants';
import { addItemToCart } from '../../services/Customer/ApiProduct';
import { useTranslation } from 'react-i18next';

const AddToCartButton = ({ product, quantity }) => {
    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.customer.accessToken);
    let decoded;
    if (accessToken) {
        decoded = jwtDecode(accessToken);
    }
    const { t } = useTranslation(["message", "user"]);
    const username = React.useMemo(() => {
        if (typeof accessToken === 'string' && accessToken.trim()) {
            try {
                return decoded.username || GUEST_ID;
            } catch {
                return GUEST_ID;
            }
        }
        return GUEST_ID;
    }, [accessToken]);
    const handleAddToCart = async () => {
        if (!product.stock || product.stock < 1) {
            return toast.error("Sản phẩm đã hết hàng");
        }
        if (decoded && ROLE.includes(decoded.role)) {
            return toast.error("Bạn Không có quyền mua hàng");
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
        try {
            const response = await addItemToCart(itemPayload.productId, itemPayload.quantity, itemPayload.price);
            if (response.data && response.data.code === 200) {
                toast.success("Đã thêm vào giỏ");
                dispatch(addToCart({ item: itemPayload, userId: username }));
            } else {
                toast.error("Không thể thêm vào giỏ hàng");
            }

        } catch (error) {
            toast.error("Lỗi khi thêm vào giỏ hàng");
            console.error(error);
        }
    };

    return (
        <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
            disabled={!product.stock}
        >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock ? t("user:product_detail.addToCart") : t("user:product_detail.outOfStock")}
        </Button>
    );
};

export default AddToCartButton;