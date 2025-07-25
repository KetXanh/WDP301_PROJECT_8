import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "../../components/customer/AddToCartButton";
import {
  detailProduct
} from "../../services/Customer/ApiProduct";
import {getRatingsByBaseProduct} from "../../services/Admin/AdminAPI"
import { useTranslation } from "react-i18next";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const { t } = useTranslation(["translation"]);
  const instructions = t("product_detail.instructions", {
    returnObjects: true,
  });

  const detail = async () => {
    try {
      setLoading(true);
      const response = await detailProduct(slug);
      if (response.data?.code === 200) {
        setProduct(response.data.data);
      } else {
        toast.error(t("product_detail.notFound"));
        navigate("/products");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error(t("product_detail.fetchError"));
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

const fetchRatings = async (productId) => {
  try {
    const res = await getRatingsByBaseProduct(productId, {
      page: 1,
      limit: 5,
    });

    console.log("Full rating response:", res.data);

    if (res.data && res.data.ratings) {
      setReviews(res.data.ratings);
    }
  } catch (err) {
    console.error("Error loading reviews:", err);
  }
};


  useEffect(() => {
    if (slug) detail();
  }, [slug]);

useEffect(() => {
  if (product?.baseProductId) {
    fetchRatings(product.baseProductId);
    console.log("Base Product ID:", product.baseProductId);
  }
}, [product]);



  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
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
      toast.success("Link sản phẩm đã được sao chép vào clipboard");
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
        <Star
          key="half"
          className="h-4 w-4 text-yellow-400 fill-current opacity-50"
        />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin h-32 w-32 border-b-2 border-green-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("product_detail.loading")}</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
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
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{product.rating || 0}</span>
              <span className="text-gray-500">
                ({product.reviews || 0} {t("product_detail.rating")})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-green-600">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                  <Badge className="bg-red-500 hover:bg-red-600">
                    -{discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">
                  {t("product_detail.weight")}:
                </span>
                <span className="ml-2 font-medium">{product.weight}g</span>
              </div>
              <div>
                <span className="text-gray-600">
                  {t("product_detail.origin")}:
                </span>
                <span className="ml-2 font-medium">{product.origin}</span>
              </div>
              <div>
                <span className="text-gray-600">
                  {t("product_detail.expiry")}:
                </span>
                <span className="ml-2 font-medium">
                  {formatDate(product.expiryDate)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">
                  {t("product_detail.stock")}:
                </span>
                <span className="ml-2 font-medium">
                  {t("product_detail.inStock", { count: product.stock })}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                {t("product_detail.quantity")}
              </span>
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
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                />
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("product_detail.healthBenefits")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.benefits?.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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

        {/* Reviews */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              {t("product_detail.customerReviews")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={review._id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.user?.avatar?.url}
                        alt={review.user?.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-800">
                          {review.user?.username ||
                            t("product_detail.anonymous")}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.stars)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                  {review.images?.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`review-${idx}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500"> {t("product_detail.noRating")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;
