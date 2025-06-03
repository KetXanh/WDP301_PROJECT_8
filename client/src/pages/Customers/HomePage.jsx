import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star, Truck, Shield, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';


const HomePage = () => {
    const featuredProducts = [
        {
            id: 1,
            name: 'Hạt Óc Chó Cao Cấp',
            price: '299.000đ',
            originalPrice: '350.000đ',
            image: '🥜',
            rating: 4.8,
            description: 'Hạt óc chó tươi ngon, giàu omega-3'
        },
        {
            id: 2,
            name: 'Hạnh Nhân Mỹ',
            price: '249.000đ',
            originalPrice: '280.000đ',
            image: '🌰',
            rating: 4.9,
            description: 'Hạnh nhân thơm ngon, bổ dưỡng'
        },
        {
            id: 3,
            name: 'Hạt Điều Rang Muối',
            price: '189.000đ',
            originalPrice: '220.000đ',
            image: '🥜',
            rating: 4.7,
            description: 'Hạt điều rang vàng giòn tan'
        },
        {
            id: 4,
            name: 'Mix Nuts Premium',
            price: '399.000đ',
            originalPrice: '450.000đ',
            image: '🌟',
            rating: 5.0,
            description: 'Hỗn hợp các loại hạt cao cấp'
        }
    ];

    const benefits = [
        {
            icon: <Truck className="h-8 w-8 text-green-600" />,
            title: 'Giao Hàng Nhanh',
            description: 'Miễn phí giao hàng cho đơn từ 500k'
        },
        {
            icon: <Shield className="h-8 w-8 text-green-600" />,
            title: 'Chất Lượng Đảm Bảo',
            description: 'Sản phẩm chính hãng, tươi ngon'
        },
        {
            icon: <Award className="h-8 w-8 text-green-600" />,
            title: 'Thương Hiệu Uy Tín',
            description: 'Hơn 10 năm kinh nghiệm'
        },
        {
            icon: <Heart className="h-8 w-8 text-green-600" />,
            title: 'Tư Vấn Tận Tình',
            description: 'Hỗ trợ 24/7 cho khách hàng'
        }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
            {/* Hero Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                        Hạt Dinh Dưỡng
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600">
                            {' '}Cao Cấp
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Khám phá thế giới hạt dinh dưỡng tươi ngon, chất lượng cao với những lợi ích tuyệt vời cho sức khỏe của bạn
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-lg px-8 py-3">
                            Mua Ngay
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                            Tìm Hiểu Thêm
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-white/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Sản Phẩm Nổi Bật
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300 group">
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
                                        <span className="text-2xl font-bold text-green-600">{product.price}</span>
                                        <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                                    </div>
                                    <Button className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Thêm Vào Giỏ
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Tại Sao Chọn NutiGo?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-white rounded-full shadow-lg">
                                        {benefit.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-amber-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Bắt Đầu Hành Trình Sức Khỏe Cùng NutiGo
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Đăng ký ngay để nhận ưu đãi đặc biệt và cập nhật những sản phẩm mới nhất
                    </p>
                    <Link to="/register">
                        <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                            Đăng Ký Ngay
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default HomePage;