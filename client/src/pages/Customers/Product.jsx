import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../../components/customer/ProductCard';
import ProductFilters from '../../components/customer/ProductFilters';
const Product = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 500000]);

    const allProducts = [
        {
            id: 1,
            name: 'Hạt Óc Chó Cao Cấp',
            price: 299000,
            originalPrice: 350000,
            image: '🥜',
            rating: 4.8,
            description: 'Hạt óc chó tươi ngon, giàu omega-3',
            category: 'nuts',
            inStock: true
        },
        {
            id: 2,
            name: 'Hạnh Nhân Mỹ',
            price: 249000,
            originalPrice: 280000,
            image: '🌰',
            rating: 4.9,
            description: 'Hạnh nhân thơm ngon, bổ dưỡng',
            category: 'nuts',
            inStock: true
        },
        {
            id: 3,
            name: 'Hạt Điều Rang Muối',
            price: 189000,
            originalPrice: 220000,
            image: '🥜',
            rating: 4.7,
            description: 'Hạt điều rang vàng giòn tan',
            category: 'roasted',
            inStock: true
        },
        {
            id: 4,
            name: 'Mix Nuts Premium',
            price: 399000,
            originalPrice: 450000,
            image: '🌟',
            rating: 5.0,
            description: 'Hỗn hợp các loại hạt cao cấp',
            category: 'mix',
            inStock: true
        },
        {
            id: 5,
            name: 'Hạt Macca Úc',
            price: 459000,
            originalPrice: 520000,
            image: '🌰',
            rating: 4.9,
            description: 'Hạt macca cao cấp từ Úc',
            category: 'nuts',
            inStock: true
        },
        {
            id: 6,
            name: 'Hạt Dẻ Cười Iran',
            price: 329000,
            originalPrice: 380000,
            image: '🥜',
            rating: 4.6,
            description: 'Hạt dẻ cười thơm ngon từ Iran',
            category: 'nuts',
            inStock: false
        },
        {
            id: 7,
            name: 'Hạt Hạnh Nhân Rang',
            price: 269000,
            originalPrice: 300000,
            image: '🌰',
            rating: 4.8,
            description: 'Hạnh nhân rang giòn thơm',
            category: 'roasted',
            inStock: true
        },
        {
            id: 8,
            name: 'Mix Nuts Organic',
            price: 599000,
            originalPrice: 680000,
            image: '🌟',
            rating: 4.9,
            description: 'Hỗn hợp hạt hữu cơ cao cấp',
            category: 'mix',
            inStock: true
        }
    ];

    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            default:
                return a.name.localeCompare(b.name);
        }
    });
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Sản Phẩm</h1>
                    <p className="text-gray-600">Khám phá bộ sưu tập hạt dinh dưỡng cao cấp của chúng tôi</p>
                </div>

                {/* Search and Sort */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Sắp xếp theo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Tên A-Z</SelectItem>
                            <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                            <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                            <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <ProductFilters
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-gray-600">
                                Hiển thị {sortedProducts.length} / {allProducts.length} sản phẩm
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {sortedProducts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                        setPriceRange([0, 500000]);
                                    }}
                                    className="mt-4"
                                >
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;