import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
const ProductCard = ({ product }) => {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 group relative">
            {discount > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 z-10">
                    -{discount}%
                </Badge>
            )}

            {!product.inStock && (
                <Badge variant="secondary" className="absolute top-2 left-2 z-10">
                    Hết hàng
                </Badge>
            )}

            <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                    {product.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                    {product.description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                    </div>
                </div>

                <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-green-600">
                        {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    {discount > 0 && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                            {product.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                    )}
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                    disabled={!product.inStock}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProductCard;