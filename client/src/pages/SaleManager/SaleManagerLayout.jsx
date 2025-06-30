import React, { useEffect, useState } from 'react';
import { Outlet, NavLink } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar 
} from "../../components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode';
import { logout } from '../../store/customer/authSlice';
import { customerProfile } from '../../services/Customer/ApiAuth';
import { toast } from "sonner";
import {
  BarChart3,
  ClipboardList,
  Users,
  Percent,
  FileText,
  LayoutDashboard,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Bell
} from "lucide-react";

// Navigation Item Component
function NavigationItem({ title, url, icon: Icon }) {
  const { open } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink 
          to={url} 
          end 
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              isActive 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105" 
                : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-emerald-50 hover:text-emerald-600 hover:shadow-md"
            }`
          }
        >
          {Icon && <Icon className={`h-5 w-5 ${open ? '' : 'mx-auto'}`} />}
          {open && <span className="text-sm font-semibold">{title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function SaleManagerLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { open } = useSidebar();

  const accessToken = useSelector((state) => state.customer.accessToken);

  const navigationItems = [
    {
      title: "Tổng quan",
      url: "/sale-manager",
      icon: LayoutDashboard
    },
    {
      title: "Thống kê",
      url: "/sale-manager/statistics",
      icon: BarChart3
    },
    {
      title: "Quản lý task",
      url: "/sale-manager/task",
      icon: ClipboardList
    },
    {
      title: "KPI nhân viên",
      url: "/sale-manager/kpi",
      icon: Users
    },
    {
      title: "Khuyến mãi",
      url: "/sale-manager/discount",
      icon: Percent
    },
    {
      title: "Quản lý order",
      url: "/sale-manager/order",
      icon: FileText
    },
    {
      title: "Chat",
      url: "/sale-manager/chat",
      icon: MessageSquare
    },
    {
      title: "Hồ sơ cá nhân",
      url: "/sale-manager/profile",
      icon: User
    }
  ];

  const fetchProfile = async () => {
    try {
      const res = await customerProfile();
      if (res.data && res.data.code === 200) {
        setUser(res.data.user);
      } else if (res.data && res.data.code === 401) {
        dispatch(logout());
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.log('Lỗi gọi profile:', error.response?.status);
      if (error.response?.status === 403 || error.response?.status === 401) {
        dispatch(logout());
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.role === 2) { // Sale Manager role
          fetchProfile();
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        dispatch(logout());
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [accessToken, dispatch]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    console.log('Đăng xuất thành công');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-100">
      {/* Sidebar */}
      <Sidebar className="border-r border-gray-200 bg-white/90 backdrop-blur-sm shadow-xl">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center space-x-4">
            {isLoggedIn && user ? (
              <>
                <Avatar className="h-12 w-12 ring-4 ring-white/20 shadow-lg">
                  <AvatarImage src={user?.avatar?.url} alt={user?.username} />
                  <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {open && (
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-white">
                      {user?.username || "Quản lý cửa hàng"}
                    </h2>
                    <p className="text-sm text-emerald-100">
                      {user?.email}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-emerald-100">Online</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-white">
                  {open ? "Quản lý cửa hàng" : "QL"}
                </h2>
                {open && (
                  <p className="text-sm text-emerald-100">
                    Vui lòng đăng nhập
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Content */}
        <SidebarContent className="flex-1">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Điều hướng
              </h3>
              <SidebarMenu className="space-y-2">
                {navigationItems.map((item) => (
                  <NavigationItem 
                    key={item.url}
                    title={item.title}
                    url={item.url}
                    icon={item.icon}
                  />
                ))}
              </SidebarMenu>
            </div>
          </div>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="border-t border-gray-100 bg-gray-50/50 p-4">
          <SidebarMenu className="space-y-2">
            {isLoggedIn && user ? (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 rounded-xl px-4 py-3 shadow-md hover:shadow-lg">
                    <User className="h-5 w-5" />
                    {open && <span className="text-sm font-semibold">Profile</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout} 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 rounded-xl px-4 py-3 shadow-md hover:shadow-lg"
                  >
                    <LogOut className="h-5 w-5" />
                    {open && <span className="text-sm font-semibold">Đăng xuất</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 rounded-xl px-4 py-3 shadow-md hover:shadow-lg">
                  <User className="h-5 w-5" />
                  {open && <span className="text-sm font-semibold">Đăng nhập</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full overflow-hidden">
            <div className="h-full overflow-auto p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 