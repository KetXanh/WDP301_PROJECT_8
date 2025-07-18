import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import logo from '../../assets/NutiGo.png'
import { customerLogin, loginGooogle } from '../../services/Customer/ApiAuth';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/customer/authSlice';
import LoginGoogle from '../../components/customer/LoginGoogle';
import { jwtDecode } from "jwt-decode";
import { mergeGuestCart } from '../../store/customer/cartSlice';
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const dispatch = useDispatch();
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
            if (!formData.email || !formData.password) {
                return toast.error("Email Hoặc Mật Khẩu Không Để Trống")
            }
            if (!isValidEmail(formData.email)) {
                return toast.error("Email Không Đúng Định Dạng")
            }
            const res = await customerLogin(formData);
            if (res.data && res.data.code === 200) {
                const dataToken = {
                    accessToken: res.data?.accessToken,
                    refreshToken: res.data?.refreshToken
                }
                const decoded = jwtDecode(dataToken.accessToken);
                dispatch(login(dataToken))
                dispatch(mergeGuestCart({ userId: decoded.username }));

                toast.success("Đăng Nhập Thành Công")
                if (decoded?.role === 0) {
                    navigate('/')

                }else if (decoded?.role === 1) {
                    navigate('/admin-dev')
                }
                else if (decoded?.role === 2) {
                    navigate('/sale-manager')
                }
                else if (decoded?.role === 3) {
                    navigate('/admin')
                }
                else if (decoded?.role === 4) {
                    navigate('/sale-staff')
                }

            } else if (res.data) {
                const status = res.data.code;
                switch (status) {
                    case 400:
                        toast.error("Email Không Tồn Tại");
                        break;
                    case 403:
                        toast.error("Mật Khẩu Không Đúng");
                        break;
                    case 402:
                        toast.error("Tài Khoản Không Tồn Tại");
                        break;
                    case 401:
                        toast.error("Tài Khoản Chưa Xác Thực");
                        console.log(formData.email);
                        navigate(`/verify/${formData.email}`);
                        break;
                    default:
                        toast.error("Đăng Nhập Thất Bại");
                        break;
                }
            } else {
                toast.error("Không thể kết nối đến máy chủ");
            }
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ");
            console.log(error);

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
                            Đăng Nhập
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Chào mừng bạn trở lại với cửa hàng hạt dinh dưỡng
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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


                            <div className="flex items-end justify-between">
                                <label className="flex items-center">
                                </label>
                                <button onClick={() => navigate('/forgot-password')} type="button" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                    Quên mật khẩu?
                                </button>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                Đăng Nhập
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
                                Chưa có tài khoản?
                                <Link
                                    to="/register"
                                    className="ml-1 text-green-600 hover:text-green-700 font-medium"
                                >
                                    Đăng ký ngay
                                </Link>
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