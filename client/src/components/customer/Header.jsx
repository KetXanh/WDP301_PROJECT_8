import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { customerProfile } from "../../services/Customer/ApiAuth";
import { logout } from "../../store/customer/authSlice";
import logo from "../../assets/NutiGo.png";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("user");

  const accessToken = useSelector((state) => state.customer.accessToken);
  const dispatch = useDispatch();

  const profile = async () => {
    try {
      const res = await customerProfile();
      if (res.data && res.data.code === 200) {
        setUser(res.data.user);
      } else if (res.data && res.data.code === 401) {
        dispatch(logout());
      }
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        dispatch(logout());
      }
    }
  };

  const cartItems = useSelector((state) =>
    username ? state.cart.items[username] || [] : []
  );
  const badgeCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      setUsername(decoded.username);
      if (decoded.role === 0) {
        profile();
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [accessToken]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    dispatch(logout());
    navigate("/");
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
            <Button variant="ghost" size="icon" className="relative">
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
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span onClick={() => navigate("/profile")}>
                      {t("viewProfile")}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
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
                <div className="flex items-center gap-2 ml-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={i18n.language === "en"}
                      onChange={() => {
                        const newLang = i18n.language === "vi" ? "en" : "vi";
                        i18n.changeLanguage(newLang);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></div>
                  </label>
                  <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                    {i18n.language === "vi" ? "VN" : "EN"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
