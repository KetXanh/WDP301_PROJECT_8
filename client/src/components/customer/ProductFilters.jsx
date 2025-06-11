import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
const ProductFilters = ({
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceRangeChange
}) => {
    const categories = [
        { id: 'all', name: 'Tất cả sản phẩm', icon: '🌟' },
        { id: 'nuts', name: 'Hạt tự nhiên', icon: '🥜' },
        { id: 'roasted', name: 'Hạt rang', icon: '🔥' },
        { id: 'mix', name: 'Hỗn hợp', icon: '🎯' }
    ];
    return (
        <div className="space-y-6">
            {/* Categories */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Danh Mục</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => onCategoryChange(category.id)}
                        >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Khoảng Giá</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm text-gray-600">
                            {priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ
                        </Label>
                        <Slider
                            value={priceRange}
                            onValueChange={onPriceRangeChange}
                            max={500000}
                            min={0}
                            step={10000}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>0đ</span>
                        <span>500,000đ</span>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Lọc Nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                        🔥 Sản phẩm hot
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                        💰 Giảm giá
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                        ⭐ Đánh giá cao
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductFilters;