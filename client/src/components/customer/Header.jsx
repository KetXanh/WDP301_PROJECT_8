import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, User, Package , Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { customerProfile } from '../../services/Customer/ApiAuth';
import { logout } from '../../store/customer/authSlice';
import logo from '../../assets/NutiGo.png';
import { jwtDecode } from 'jwt-decode';
import { GUEST_ID } from '../../store/customer/constans';
import { useTranslation } from "react-i18next";
import { getAllItemCart } from '../../services/Customer/ApiProduct';
import { clearCart, setCartFromServer } from '../../store/customer/cartSlice';
import { toast } from "react-toastify";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, i18n } = useTranslation(['translation']);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.customer.accessToken);
  const username = React.useMemo(() => {
    if (typeof accessToken === 'string' && accessToken.trim()) {
      try {
        const decoded = jwtDecode(accessToken);
        return decoded.username || GUEST_ID;
      } catch {
        return GUEST_ID;
      }
    }
    return GUEST_ID;
  }, [accessToken]);
  const cartItems = useSelector(
    state => state.cart.items[username] ?? []
  );

  const badgeCount = cartItems.length === 0 ? 0 : cartItems.length;

  const profile = async () => {
    try {
      const res = await customerProfile();
      if (res.data && res.data.code === 200) {
        setUser(res.data.user);
      } else if (res.data && res.data.code === 401) {
        dispatch(logout());
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.log('Lỗi gọi profile:', error.response?.status);
      if (error.response?.status === 403 || error.response?.status === 401) {
        dispatch(logout());
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getAllItemCart();
        if (res.data && res.data.code === 200) {
          dispatch(setCartFromServer({ userId: username, items: res.data.data ?? [] }));
        } else {
          dispatch(clearCart({ userId: username }));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          dispatch(clearCart({ userId: username }));
        } else {
          console.error("Lỗi khi lấy giỏ hàng:", error);
          dispatch(clearCart({ userId: username }));
        }
      }
    };

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.role === 0) {
          profile();
          setIsLoggedIn(true);
          fetchCart();
        }
      } catch (error) {
        console.error('Invalid token:', error);
        dispatch(logout());
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [accessToken, dispatch]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    dispatch(logout());
    toast.success(t('toast.logout'))
    navigate('/');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleGoToDiscount = () => {
    navigate("/discount");
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src={logo} alt="logo" />
            </div>
            <span className="text-2xl font-bold text-gray-800">NutiGo</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              {t("home.home")}
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              {t("home.products")}
            </Link>
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              {t("home.aboutUs")}
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              {t("home.contact")}
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/cart")}
              variant="ghost"
              size="icon"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none rounded-full px-1.5 h-4 min-w-4 flex items-center justify-center">
                  {badgeCount}
                </span>
              )}
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.avatar?.url}
                        alt={user?.username}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-green-600 to-amber-600 text-white">
                        {user?.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user?.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleGoToDiscount}>
                    <Tag className="h-4 w-4 mr-2 text-pink-500" />
                    <span>Mã giảm giá</span>
                    <span className="ml-1 bg-pink-100 text-pink-600 text-xs rounded px-2 py-0.5 font-bold animate-pulse">HOT</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span onClick={() => navigate("/profile")}>
                      {t("home.viewProfile")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/order-history")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span>{t("home.viewOrder")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("home.logout")}</span>
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">{t("home.login")}</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700">
                    {t("home.register")}
                  </Button>
                </Link>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <span>{i18n.language === "vi" ? "VN" : "EN"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeLanguage("en")}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeLanguage("vi")}
                >
                  Tiếng Việt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;