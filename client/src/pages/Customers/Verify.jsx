import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { customerResendOtp, customerVerify } from '../../services/Customer/ApiAuth';
const Verify = () => {
    const [otpValue, setOtpValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { email } = useParams();
    const handleVerify = async () => {
        if (otpValue.length !== 6) {
            toast.error("Vui lòng nhập đầy đủ 6 số");
            return;
        }
        setIsLoading(true);
        try {
            if (!email) {
                toast.error("Không Tìm Thấy Email");
                navigate(-1)
                return;
            }
            setIsLoading(false);
            const res = await customerVerify(email, otpValue);
            if (res.data && res.status === 200) {
                toast.success("Xác Thực Tài Khoản Thành Công")
                navigate('/login')
            } else if (res.data && res.status === 400) {
                toast.error("OTP Không Chính Xác")
            } else {
                toast.error("Xác THực Tài Khoản Thất Bại")
            }
        } catch (error) {
            console.log("Server Error", error);

        }

    };

    const handleResendCode = async () => {
        try {
            if (!email) {
                toast.error("Không Tìm Thấy Email");
                navigate(-1)
                return;
            }
            const res = await customerResendOtp(email);
            if (res.data && res.status === 200) {
                toast.success("Gửi OTP Thành Công")
            } else if (res.data && res.status === 400) {
                toast.error("Tài Khoản Đã Được Xác Thực")
                navigate('/login')
            } else {
                toast.error("Gửi OTP Thất Bại")
            }
        } catch (error) {
            console.log("Server Error", error);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <Link
                        to="/register"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Link>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📧</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Xác Thực Email
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Chúng tôi đã gửi mã xác thực 6 số đến email của bạn.
                            Vui lòng nhập mã để hoàn tất đăng ký.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <label className="text-sm font-medium text-gray-700">
                                Nhập mã xác thực
                            </label>

                            <InputOTP
                                maxLength={6}
                                value={otpValue}
                                onChange={(value) => setOtpValue(value)}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <Button
                            onClick={handleVerify}
                            disabled={isLoading || otpValue.length !== 6}
                            className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                        >
                            {isLoading ? "Đang xác thực..." : "Xác Thực"}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                Không nhận được mã?
                            </p>
                            <button
                                onClick={handleResendCode}
                                className="text-sm text-green-600 hover:text-green-700 font-medium underline"
                            >
                                Gửi lại mã xác thực
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Verify;