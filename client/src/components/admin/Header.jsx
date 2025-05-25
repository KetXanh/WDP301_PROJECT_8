import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdSpaceDashboard } from "react-icons/md";
const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  return (
    <nav
      className="fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 
        dark:border-gray-700 "
    >
      <div className="px-3 py-3 lg:px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={toggleSidebar}
              className="text-gray-800 dark:text-white text-2xl hover:text-blue-500 dark:hover:text-blue-300"
            >
              <HiOutlineMenuAlt2 />
            </button>

            <a href="#" className="flex ms-2 md:me-24">
              <MdSpaceDashboard className="h-8 me-3 text-xl text-violet-500"></MdSpaceDashboard>
              <span
                className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap
              dark:text-white"
              >
                NutiGo
              </span>
            </a>
          </div>
          <button
            className="dark:bg-slate-50
          dark:text-slate-700 rounded-full p-2"
            onClick={toggleDarkMode}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
