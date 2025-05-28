import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Xử lý đăng nhập/đăng ký ở đây
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🌰</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {isLogin
                                ? 'Chào mừng bạn trở lại với cửa hàng hạt dinh dưỡng'
                                : 'Tạo tài khoản mới để khám phá các sản phẩm hạt dinh dưỡng tuyệt vời'
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                        Họ và tên
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            placeholder="Nhập họ và tên của bạn"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Nhập địa chỉ email của bạn"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Nhập mật khẩu của bạn"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                        Xác nhận mật khẩu
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Nhập lại mật khẩu của bạn"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                        <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                                    </label>
                                    <button type="button" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                        Quên mật khẩu?
                                    </button>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Hoặc</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Đăng nhập bằng Google
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-1 text-green-600 hover:text-green-700 font-medium"
                                >
                                    {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Bằng việc đăng nhập, bạn đồng ý với{' '}
                        <a href="#" className="text-green-600 hover:text-green-700">Điều khoản sử dụng</a>
                        {' '}và{' '}
                        <a href="#" className="text-green-600 hover:text-green-700">Chính sách bảo mật</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;