import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Target, 
  ShoppingCart, 
  MessageSquare,
  User,
  ClipboardList,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { logout } from '../../../store/customer/authSlice';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/sale-staff', icon: Home },
  { name: 'Task', href: '/sale-staff/tasks', icon: ClipboardList },
  { name: 'KPI', href: '/sale-staff/kpi', icon: Target },
  { name: 'Đơn hàng', href: '/sale-staff/orders', icon: ShoppingCart },
  { name: 'Chat', href: '/sale-staff/chat', icon: MessageSquare },
  { name: 'Hồ sơ', href: '/sale-staff/profile', icon: User },
];

export const Sidebar = () => {
  const accessToken = useSelector((state) => state.customer.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user = null;
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.role === 4) {
        user = {
          username: decoded.username,
          email: decoded.email,
          avatar: decoded.avatar ? { url: decoded.avatar } : undefined
        };
      }
    } catch {
      user = null;
    }
  }
  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        {/* Sidebar Header: Avatar + Info */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Avatar className="h-12 w-12 ring-4 ring-white/20 shadow-lg">
                  <AvatarImage src={user?.avatar?.url} alt={user?.username} />
                  <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-white">
                    {user?.username || 'Nhân viên bán hàng'}
                  </h2>
                  <p className="text-sm text-cyan-100">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs text-cyan-100">Online</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-white">Nhân viên bán hàng</h2>
                <p className="text-sm text-cyan-100">Vui lòng đăng nhập</p>
              </div>
            )}
          </div>
        </div>
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
        {/* Sidebar Footer: Logout */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 mt-auto">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 rounded-xl px-4 py-3 shadow-md hover:shadow-lg"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-semibold ml-2">Đăng xuất</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}; 