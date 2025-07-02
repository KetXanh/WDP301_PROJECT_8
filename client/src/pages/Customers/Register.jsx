import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { customerRegister } from '../../services/Customer/ApiAuth';
import { toast } from 'react-toastify';
import logo from '../../assets/NutiGo.png'
import LoginGoogle from '../../components/customer/LoginGoogle';
const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.username) {
                return toast.error("Tên Tài Khoản Không Để Trống")
            }
            if (!formData.email) {
                return toast.error("Email Không Để Trống")
            }
            if (!formData.password) {
                return toast.error("Mật Khẩu Không Để Trống")
            }
            if (!formData.confirmPassword) {
                return toast.error("Mật Khẩu Xác Nhận Không Để Trống")
            }
            if (!isValidEmail(formData.email)) {
                toast.error("Email Không Đúng Định Dạng")
            }
            if (formData.password.length < 6) {
                return toast.error("Mật Khẩu Phải Hơn 6 Ký Tự")
            }
            if (formData.password !== formData.confirmPassword) {
                return toast.error("Xác Nhận Mật Khẩu Không Khớp")
            }
            const res = await customerRegister(formData.username, formData.email, formData.password);

            if (res.data && res.data.code === 201) {
                toast.success("Đăng Ký Tài Khoản Thành Công");
                navigate(`/verify/${formData.email}`)
            } else if (res.data && res.data.code === 400) {
                toast.error(res.data?.message === "Email already exits" ? "Email Đã Tồn Tại" : "Tên Tài Khoản Đã Tồn Tại")
            } else {
                toast.error("Đăng Ký Thất Bại")
            }
        } catch (error) {
            console.log("Server error", error);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto mb-4 w-16 h-16  rounded-full flex items-center justify-center">
                            <img className='' src={logo} />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Đăng Ký Tài Khoản
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Tạo tài khoản mới để khám phá các sản phẩm hạt dinh dưỡng tuyệt vời
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                    Tên đăng nhập
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Nhập tên đăng nhập của bạn"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Nhập địa chỉ email của bạn"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                    Nhập lại mật khẩu
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Nhập lại mật khẩu của bạn"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                Đăng Ký
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
                                <LoginGoogle />
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Đã có tài khoản?
                                <Link
                                    to="/login"
                                    className="ml-1 text-green-600 hover:text-green-700 font-medium"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Bằng việc đăng ký, bạn đồng ý với{' '}
                        <a href="#" className="text-green-600 hover:text-green-700">Điều khoản sử dụng</a>
                        {' '}và{' '}
                        <a href="#" className="text-green-600 hover:text-green-700">Chính sách bảo mật</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;