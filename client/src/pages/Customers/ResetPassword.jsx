import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { resetPass } from '../../services/Customer/ApiAuth';

const ResetPassword = () => {
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwords.newPassword || !passwords.confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        setIsLoading(true);

        try {
            const res = await resetPass(email, passwords.newPassword);
            if (res.data && res.data.code === 200) {
                toast.success("Cập Nhật Mật khẩu Thành Công");
                setIsLoading(false)
                navigate('/login')
            } else {
                toast.error("Cập Nhật Mật Khẩu Thất Bại")
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <Link
                        to="/otp"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Link>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Đặt Lại Mật Khẩu
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Nhập mật khẩu mới để hoàn tất quá trình đặt lại mật khẩu
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="Nhập mật khẩu mới"
                                        value={passwords.newPassword}
                                        onChange={handleInputChange}
                                        className="pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={passwords.confirmPassword}
                                        onChange={handleInputChange}
                                        className="pr-10"
                                        required
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

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-800 mb-2">Yêu cầu mật khẩu:</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Ít nhất 6 ký tự</li>
                                    <li>• Nên bao gồm chữ hoa, chữ thường và số</li>
                                    <li>• Không sử dụng thông tin cá nhân</li>
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                            >
                                {isLoading ? "Đang cập nhật..." : "Cập Nhật Mật Khẩu"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Nhớ mật khẩu?{' '}
                                <Link
                                    to="/login"
                                    className="text-green-600 hover:text-green-700 font-medium underline"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;