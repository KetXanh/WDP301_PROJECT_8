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
    const { t } = useTranslation(['translation']);
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


    const isGuest = username === GUEST_ID;



    const handleAddToCart = async () => {
        if (!product.stock || product.stock < 1) {
            return toast.error(t("toast.out_of_stock"));
        }
        if (decoded && ROLE.includes(decoded.role)) {
            return toast.error(t("toast.no_permission"));
        }

        const itemPayload = {
            productId: product._id || product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            imageUrl: product.image || product.imageUrl,
            quantity: quantity,
            stock: product.stock,
        };
        if (!isGuest) {
            try {
                const response = await addItemToCart(itemPayload.productId, itemPayload.quantity, itemPayload.price);
                if (response.data && response.data.code === 200) {
                    dispatch(addToCart({ item: itemPayload, userId: username }));
                    toast.success(t("toast.add_success"));
                } else if (response.data && response.data.code !== 200) {
                    toast.error(t("toast.add_fail"));
                }

            } catch (error) {
                toast.error(t("toast.add_error"));
                console.error(error);
            }
        }
        dispatch(addToCart({ item: itemPayload, userId: username }));
        toast.success(t("toast.add_success"));

    };

    return (
        <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
            disabled={!product.stock || product.stock <= 0}
        >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock ? t("product_detail.addToCart") : t("product_detail.outOfStock")}
        </Button>
    );
};

export default AddToCartButton;