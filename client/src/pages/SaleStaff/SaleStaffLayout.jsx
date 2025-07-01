import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login, logout } from '../../store/customer/authSlice';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const SaleStaffLayout = () => {
  const [user, setUser] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const accessToken = useSelector((state) => state.customer.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!accessToken) {
      const localToken = localStorage.getItem('accessToken');
      const localRefresh = localStorage.getItem('refreshToken');
      if (localToken) {
        dispatch(login({ accessToken: localToken, refreshToken: localRefresh }));
      }
    }
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.role === 4) {
          setUser({
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            avatar: decoded.avatar ? { url: decoded.avatar } : undefined
          });
          setIsLoggedIn(true);
        }
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, [accessToken, dispatch]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    dispatch(logout());
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="flex items-center space-x-4">
            {isLoggedIn && user ? (
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
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 mt-auto">
          {isLoggedIn && user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 rounded-xl px-4 py-3 shadow-md hover:shadow-lg"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-semibold ml-2">Đăng xuất</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 rounded-xl px-4 py-3 shadow-md hover:shadow-lg"
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-semibold ml-2">Đăng nhập</span>
            </button>
          )}
        </div>
      </Sidebar>
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SaleStaffLayout; 