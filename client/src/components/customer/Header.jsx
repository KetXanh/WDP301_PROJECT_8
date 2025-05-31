import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <div>
            {/* Header/Navigation */}
            <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center">
                                <span className="text-xl">🌰</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">NutiGo</span>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <a href="/" className="text-gray-700 hover:text-green-600 font-medium">Trang Chủ</a>
                            <a href="/product" className="text-gray-700 hover:text-green-600 font-medium">Sản Phẩm</a>
                            <a href="#" className="text-gray-700 hover:text-green-600 font-medium">Về Chúng Tôi</a>
                            <a href="#" className="text-gray-700 hover:text-green-600 font-medium">Liên Hệ</a>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon">
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                            <Link to="/login">
                                <Button variant="outline">
                                    Đăng Nhập
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700">
                                    Đăng Ký
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;