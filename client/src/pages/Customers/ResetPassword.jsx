import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { resetPass } from '../../services/Customer/ApiAuth';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation(['translation']);
    const handleInputChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwords.newPassword.trim() || !passwords.confirmPassword.trim()) {
            toast.error(t("toast.emptyFields"));
            return;
        }

        if (passwords.newPassword.trim() !== passwords.confirmPassword.trim()) {
            toast.error(t("toast.passwordMismatch"));
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error(t("toast.passwordTooShort_reset_password"));
            return;
        }

        setIsLoading(true);

        try {
            const res = await resetPass(email, passwords.newPassword.trim());
            if (res.data && res.data.code === 200) {
                toast.success(t("toast.updateSuccess"));
                setIsLoading(false)
                navigate('/login')
            } else {
                toast.error(t("toast.updateFail"))
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
                        {t("reset_password.back")}
                    </Link>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            {t("reset_password.title")}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {t("reset_password.subtitle")}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">{t("reset_password.newPassword")}</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder={t("reset_password.newPasswordPlaceholder")}
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
                                <Label htmlFor="confirmPassword">{t("reset_password.confirmPassword")}</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder={t("reset_password.confirmPasswordPlaceholder")}
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
                                <h4 className="text-sm font-medium text-blue-800 mb-2">{t("reset_password.passwordRequirementTitle")}</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>{t("reset_password.passwordRequirement1")}</li>
                                    <li>{t("reset_password.passwordRequirement2")}</li>
                                    <li>{t("reset_password.passwordRequirement3")}</li>
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700"
                            >
                                {isLoading ? t("reset_password.updating") : t("reset_password.updateButton")}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {t("reset_password.rememberPassword")}{' '}
                                <Link
                                    to="/login"
                                    className="text-green-600 hover:text-green-700 font-medium underline"
                                >
                                    {t("reset_password.loginNow")}
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