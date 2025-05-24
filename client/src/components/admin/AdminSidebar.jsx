import { Home, Package, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const menu = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/admin" },
  { name: "Sản phẩm", icon: <Package size={18} />, path: "/admin/products" },
  { name: "Người dùng", icon: <Users size={18} />, path: "/admin/users" },
  { name: "Cài đặt", icon: <Settings size={18} />, path: "/admin/settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow h-screen fixed p-4 border-r">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 text-gray-700 hover:text-black"
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
