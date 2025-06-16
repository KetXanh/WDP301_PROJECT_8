import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import AddToCartButton from './AddToCartButton';
const ProductCard = ({ product }) => {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 group relative">
            {discount > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 z-10">
                    -{discount}%
                </Badge>
            )}

            {!product.stock && (
                <Badge variant="secondary" className="absolute top-2 left-2 z-10">
                    Hết hàng
                </Badge>
            )}

            <Link to={`/products/${product.slug}`}>
                <CardHeader className="text-center pb-4 cursor-pointer">
                    <div className="aspect-square mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden rounded-lg">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors">
                        {product.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        {product.description}
                    </CardDescription>
                </CardHeader>
            </Link>

            <CardContent>
                <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating || 0}</span>
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

                <AddToCartButton product={product} quantity={1} />
            </CardContent>
        </Card>
    );
};

export default ProductCard;