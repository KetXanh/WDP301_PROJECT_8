import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const LinkItem = ({ href, icon: Icon, text, badge }) => {
    const { t } = useTranslation("admin");
  return (
    <li>
      <Link
        to={href}
        className="flex items-center justify-between p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-base">{t(text)}</span>
        </div>

        {badge && (
          <span
            className={`ml-auto inline-flex items-center justify-center px-2 text-sm font-medium rounded-full 
                        ${badge.color} ${badge.darkColor}`}
          >
            {badge.text}
          </span>
        )}
      </Link>
    </li>
  );
};

export default LinkItem;
