import React from "react";

const LinkItem = ({ href, icon: Icon, text, badge }) => {
  return (
    <li>
      <a
        href={href}
        className="flex items-center justify-between p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {/* Icon và text */}
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-base">{text}</span>
        </div>

        {/* Badge nếu có */}
        {badge && (
          <span
            className={`ml-auto inline-flex items-center justify-center px-2 text-sm font-medium rounded-full 
                        ${badge.color} ${badge.darkColor}`}
          >
            {badge.text}
          </span>
        )}
      </a>
    </li>
  );
};

export default LinkItem;
