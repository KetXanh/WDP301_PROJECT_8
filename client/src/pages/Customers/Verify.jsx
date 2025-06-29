import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { customerResendOtp, customerVerify } from '../../services/Customer/ApiAuth';
import { useTranslation } from 'react-i18next';
const Verify = () => {
    const [otpValue, setOtpValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { email } = useParams();
    const { t } = useTranslation(["message", "user"]);
    const handleVerify = async () => {
        if (otpValue.length !== 6) {
            toast.error(t("toast.otpRequired_verify"));
            return;
        }
        setIsLoading(true);
        try {
            if (!email) {
                toast.error(t("toast.emailNotFound"));
                navigate(-1)
                return;
            }
            const res = await customerVerify(email, otpValue);
            if (res.data && res.data.code === 200) {
                toast.success(t("toast.verifySuccess"))
                navigate('/login')
            } else if (res.data && res.data.code === 400) {
                toast.error(t("toast.otpInvalid_verify"))
            } else {
                toast.error(t("toast.verifyFail"))
            }
            setIsLoading(false);

        } catch (error) {
            console.log("Server Error", error);

        }

    };


    const handleResendCode = async () => {
        if (!email) {
            toast.error(t("toast.emailNotFound"));
            navigate(-1)
            return;
        }
        try {
            const res = await customerResendOtp(email);

            if (res.data && res.data.code === 200) {
                toast.success(t("toast.resendSuccess"))
            } else if (res.data && res.data.code === 400) {
                toast.error(t("toast.alreadyVerified"));
                navigate('/login');
            } else {
                toast.error(t("toast.resendFail"));
            }
        } catch (error) {
            toast.error(t("toast.serverError"));
            console.log(error);

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
                        {t("user:verify.back")}
                    </Link>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📧</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            {t("user:verify.title")}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {t("user:verify.subtitle")}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <label className="text-sm font-medium text-gray-700">
                                {t("user:verify.label")}
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
                            {isLoading ? t("user:verify.verifying") : ("user:verify.verify")}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                {t("user:verify.notReceived")}
                            </p>
                            <button
                                onClick={handleResendCode}
                                className="text-sm text-green-600 hover:text-green-700 font-medium underline"
                            >
                                {t("user:verify.resend")}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Verify;