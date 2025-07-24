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
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation(['translation']);
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
            if (!formData.username.trim()) {
                return toast.error(t('toast.usernameEmpty'))
            }
            if (!formData.email.trim()) {
                return toast.error(t('toast.emailEmpty'))
            }
            if (!formData.password.trim()) {
                return toast.error(t('toast.passwordEmpty'))
            }
            if (!formData.confirmPassword.trim()) {
                return toast.error(t('toast.confirmPasswordEmpty'))
            }
            if (!isValidEmail(formData.email.trim())) {
                toast.error(t('toast.invalidEmailFormatRegister'))
            }
            if (formData.password.length < 6) {
                return toast.error(t('toast.passwordTooShort'))
            }
            if (formData.password.trim() !== formData.confirmPassword.trim()) {
                return toast.error(t('toast.confirmPasswordMismatch'))
            }
            const res = await customerRegister(formData.username.trim(), formData.email.trim(), formData.password.trim());

            if (res.data && res.data.code === 201) {
                toast.success(t('toast.registerSuccess'));
                navigate(`/verify/${formData.email.trim()}`)
            } else if (res.data && res.data.code === 400) {
                toast.error(res.data?.message === "Email already exits" ? t('toast.emailExists') : t('toast.usernameExists'))
            } else {
                toast.error(t('toast.registerFailed'))
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
                            {t('register.title')}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {t('register.subtitle')}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                    {t('register.usernameLabel')}
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder={t('register.usernamePlaceholder')}
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
                                        placeholder={t('register.emailPlaceholder')}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    {t('register.passwordLabel')}
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={t('register.passwordPlaceholder')}
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
                                    {t('register.confirmPasswordLabel')}
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder={t('register.confirmPasswordPlaceholder')}
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
                                {t('register.registerButton')}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">{t('register.divider')}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <LoginGoogle />
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {t('register.alreadyHaveAccount')}
                                <Link
                                    to="/login"
                                    className="ml-1 text-green-600 hover:text-green-700 font-medium"
                                >
                                    {t('register.loginNow')}
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        {t('register.termsPrefix')}{' '}
                        <a href="#" className="text-green-600 hover:text-green-700">{t('register.termsOfUse')}{' '}</a>
                        {' '}{t('register.and')}{' '}
                        <a href="#" className="text-green-600 hover:text-green-700">{t('register.privacyPolicy')}</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;