import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import logo from "../../assets/NutiGo.png";
import { useTranslation } from "react-i18next";

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const { t, i18n } = useTranslation("common");

  const switchLanguage = () => {
    const newLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Sidebar Toggle + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-200 text-2xl hover:text-green-600 transition-colors"
          >
            <HiOutlineMenuAlt2 />
          </button>

          <a href="#" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {t("menu.admin")}
            </span>
          </a>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={i18n.language === "en"}
                onChange={switchLanguage}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></div>
            </label>
            <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
              {i18n.language === "vi" ? "VN" : "EN"}
            </span>
          </div> */}

          <button
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
