import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Target, 
  ShoppingCart, 
  MessageSquare,
  User,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/sale-staff', icon: Home },
  { name: 'Thống kê', href: '/sale-staff/statistics', icon: BarChart3 },
  { name: 'KPI', href: '/sale-staff/kpi', icon: Target },
  { name: 'Đơn hàng', href: '/sale-staff/orders', icon: ShoppingCart },
  { name: 'Task', href: '/sale-staff/tasks', icon: ClipboardList },
  { name: 'Chat', href: '/sale-staff/chat', icon: MessageSquare },
  { name: 'Hồ sơ', href: '/sale-staff/profile', icon: User },
];

export const Sidebar = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold text-gray-900">Sale Staff</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}; 