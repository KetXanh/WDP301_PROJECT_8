import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import AddToCartButton from '../../components/customer/AddToCartButton';
import { detailProduct } from '../../services/Customer/ApiProduct';
import { useTranslation } from 'react-i18next';
const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { t } = useTranslation(['translation']);
    const instructions = t("product_detail.instructions", { returnObjects: true });

    const detail = async () => {
        try {
            setLoading(true);
            const response = await detailProduct(slug);
            if (response.data && response.data.code === 200) {
                setProduct(response.data.data);

            } else {
                toast.error(t("product_detail.notFound"));
                navigate('/products');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error(t("product_detail.fetchError"));
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (slug) {
            detail();
        }

    }, [slug]);



    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
            setQuantity(newQuantity);
        }
    };


    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        // toast({
        //   title: isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
        //   description: product.name,
        // });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Đã sao chép",
                description: "Link sản phẩm đã được sao chép vào clipboard",
            });
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Star key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
            );
        }

        return stars;
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t("product_detail.loading")}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/products')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("product_detail.back")}
                    </Button>
                    <span className="text-gray-400">/</span>
                    <Link to="/products" className="text-gray-600 hover:text-green-600">
                        {t("product_detail.product")}
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800 font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImageIndex === index
                                            ? 'border-green-600'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )} */}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {product.name}
                            </h1>
                            <p className="text-gray-600">{product.description}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <span className="ml-1 font-medium">{product.rating || 0}</span>
                            </div>
                            <span className="text-gray-500">({product.reviews || 0} {t("product_detail.rating")})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-green-600">
                                {product.price.toLocaleString('vi-VN')}đ
                            </span>
                            {discount > 0 && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">
                                        {product.originalPrice.toLocaleString('vi-VN')}đ
                                    </span>
                                    <Badge className="bg-red-500 hover:bg-red-600">
                                        -{discount}%
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">{t("product_detail.weight")}:</span>
                                <span className="ml-2 font-medium">{product.weight}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">{t("product_detail.origin")}:</span>
                                <span className="ml-2 font-medium">{product.origin}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">{t("product_detail.expiry")}:</span>
                                <span className="ml-2 font-medium">{product.expiry}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">{t("product_detail.stock")}:</span>
                                <span className="ml-2 font-medium">{t("product_detail.inStock", { count: product.stock })}</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700 font-medium">{t("product_detail.quantity")}</span>
                            <div className="flex items-center border rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 font-medium">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= product.stock}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <AddToCartButton product={product} quantity={quantity} />
                            <Button
                                variant="outline"
                                onClick={handleToggleWishlist}
                                className={isWishlisted ? "text-red-600 border-red-600" : ""}
                            >
                                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                            </Button>
                            <Button variant="outline" onClick={handleShare}>
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Benefits */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("product_detail.healthBenefits")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {product.benefits?.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Usage Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("product_detail.usageInstructions")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-gray-700">
                                {instructions.map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Customer Reviews Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            {t("product_detail.customerReviews")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Overall Rating Summary */}
                        <div className="flex items-center gap-8 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-green-600 mb-1">{product.rating}</div>
                                <div className="flex items-center justify-center mb-1">
                                    {renderStars(product.rating)}
                                </div>
                                <div className="text-sm text-gray-600">{product.reviews} đánh giá</div>
                            </div>
                            <div className="flex-1">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-gray-600 w-8">{star}</span>
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{ width: `${Math.random() * 80 + 20}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">{Math.floor(Math.random() * 50)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Individual Reviews */}
                        <div className="space-y-6 ">
                            {[
                                {
                                    name: "Nguyễn Thị Mai",
                                    rating: 5,
                                    date: "2024-01-15",
                                    comment: "Sản phẩm rất tốt, chất lượng như mô tả. Hạt tươi ngon, đóng gói cẩn thận. Sẽ mua lại!"
                                },
                                {
                                    name: "Trần Văn Hùng",
                                    rating: 4,
                                    date: "2024-01-10",
                                    comment: "Hạt ngon, giá cả hợp lý. Giao hàng nhanh. Chỉ có điều bao bì hơi nhỏ so với mong đợi."
                                },
                                {
                                    name: "Lê Thị Hoa",
                                    rating: 5,
                                    date: "2024-01-08",
                                    comment: "Chất lượng tuyệt vời! Hạt to, tươi ngon. Gia đình tôi rất thích. Cảm ơn shop!"
                                }
                            ].map((review, index) => (
                                <div key={index} className="border-b border-gray-200 pb-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="font-medium text-gray-800">{review.name}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-sm text-gray-500">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* View All Reviews Button */}
                        <div className="text-center mt-6">
                            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                {t("product_detail.seeAllReviews")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetail;