import React from "react";
import { FaMoon, FaSun, FaSignOutAlt, FaBell, FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import logo from "../../assets/NutiGo.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success(t("Đăng xuất thành công !")); 
    setTimeout(() => {
      navigate("/login"); 
    }, 500);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar Toggle + Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 group"
            >
              <HiOutlineMenuAlt2 className="text-xl group-hover:scale-110 transition-transform duration-200" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="NutiGo Logo" 
                  className="w-10 h-10 object-contain drop-shadow-sm" 
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("Admin")}
                </span>
                <span className="text-xs text-gray-500">Dashboard</span>
              </div>
            </div>
          </div>

          {/* Right: Tools */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group">
              <FaBell className="text-lg group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile */}
            <button className="flex items-center gap-2 p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 group">
              <FaUserCircle className="text-xl group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium hidden sm:block">Admin</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 group"
              title={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {darkMode ? (
                <FaSun className="text-lg group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <FaMoon className="text-lg group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300 mx-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg group"
              title="Đăng xuất"
            >
              <FaSignOutAlt className="text-sm group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium hidden sm:block">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
