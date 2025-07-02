import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { otpForgotPass } from '../../services/Customer/ApiAuth';
const ForgotOtp = () => {
    const [otpValue, setOtpValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const email = location.state?.email;
    const navigate = useNavigate();

    const handleVerify = async () => {
        if (otpValue.length !== 6) {
            toast.error("Vui lòng nhập đầy đủ 6 số");
            return;
        }

        setIsLoading(true);

        try {
            if (!otpValue) {
                return toast.error("Vui Lòng Nhập OTP")
            }
            const res = await otpForgotPass(otpValue, email);

            if (res.data && res.data.code === 200) {
                navigate('/reset-password', { state: { email } })
            } else if (res.data && res.data.code === 400) {
                toast.error("Mã OTP Không Đúng")
            } else if (res.data && res.data.code === 401) {
                toast.error("Email Không Tồn Tại")
            } else {
                toast.error("Gửi OTP Thất Bại")
            }
            setIsLoading(false)

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Link>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Xác Thực OTP
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Chúng tôi đã gửi mã OTP 6 số đến email của bạn.
                            Vui lòng nhập mã để tiếp tục đặt lại mật khẩu.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <label className="text-sm font-medium text-gray-700">
                                Nhập mã OTP
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
                            {isLoading ? "Đang xác thực..." : "Xác Thực OTP"}
                        </Button>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotOtp;