import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getCategories } from '../../services/Customer/ApiProduct';
import { useEffect } from 'react';

const ProductFilters = ({ selectedCategory, onCategoryChange, priceRange, onPriceRangeChange }) => {
    const [openParent, setOpenParent] = useState(null);

    const [categories, setCategories] = useState([])
    const getAllCategories = async () => {
        try {
            const res = await getCategories();
            if (res.data && res.data.code === 200) {
                setCategories(res.data.data)
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    const toggleParent = (parentId) => {
        setOpenParent(openParent === parentId ? null : parentId);
    };

    return (
        <Card className="bg-white shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800">Bộ lọc sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Danh mục</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => onCategoryChange('all')}
                            className={`w-full text-left px-4 py-2 rounded-lg ${selectedCategory === 'all' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'
                                }`}
                        >
                            Tất cả danh mục
                        </button>
                        {categories.map((parent) => (
                            <div key={parent.id}>
                                <button
                                    onClick={() => toggleParent(parent.id)}
                                    className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    <span>{parent.name}</span>
                                    {openParent === parent.id ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                                {openParent === parent.id && (
                                    <div className="pl-4 space-y-1 mt-1">
                                        {parent.children.map((child) => (
                                            <button
                                                key={child.id}
                                                onClick={() => onCategoryChange(child.name)}
                                                className={`w-full text-left px-4 py-2 text-sm rounded-lg ${selectedCategory === child.id ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                {child.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Price Range Filter */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Khoảng giá</h3>
                    <Slider
                        value={priceRange}
                        onValueChange={onPriceRangeChange}
                        min={0}
                        max={500000}
                        step={1000}
                        className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
                        <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductFilters;