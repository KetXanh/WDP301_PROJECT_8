import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { customerForgotPass } from '../../services/Customer/ApiAuth';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Vui lòng nhập email",
            );
            return;
        }
        setIsLoading(true);
        try {
            if (!email) {
                return toast.error("Vui Lòng Nhập Email")
            }
            const res = await customerForgotPass(email);
            console.log(res);

            if (res.data && res.data.code === 200) {
                navigate(`/otp`, { state: { email } });
                setIsLoading(false)
            } else if (res.data && res.data.code === 401) {
                toast.error("Email Không Tồn Tại")
                setIsLoading(false)
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
                        to="/login"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại đăng nhập
                    </Link>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Quên Mật Khẩu
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                            >
                                {isLoading ? "Đang gửi..." : "Gửi Link Đặt Lại"}
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

export default ForgotPassword;