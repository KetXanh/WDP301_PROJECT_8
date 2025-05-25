import React from "react";
import { links } from "../../constants";
import LinkItem from "./LinkItem";

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20
        bg-white dark:bg-gray-900
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto text-gray-900 dark:text-white">
        <ul className="space-y-2 font-medium">
          {links.map((link, index) => (
            <LinkItem key={index} {...link} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
