import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  Shield,
  LogOut,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { changeSaleManagerPassword } from "@/services/SaleManager/ApiSaleManager";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../store/customer/authSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const accessToken = useSelector((state) => state.customer.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUser({
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
          avatar: decoded.avatar ? { url: decoded.avatar } : undefined,
          fullName: decoded.fullName,
          position: decoded.position,
          department: decoded.department,
          team: decoded.team,
          manager: decoded.manager,
          createdAt: decoded.createdAt,
          stats: decoded.stats || {},
          phone: decoded.phone,
          address: decoded.address,
          bio: decoded.bio,
        });
        setEditForm({
          username: decoded.username,
          email: decoded.email,
          fullName: decoded.fullName,
          position: decoded.position,
          department: decoded.department,
          team: decoded.team,
          manager: decoded.manager,
          createdAt: decoded.createdAt,
          bio: decoded.bio,
          address: decoded.address,
          phone: decoded.phone,
        });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [accessToken]);

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    toast.success('Cập nhật thông tin thành công (local only)');
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }
    try {
      await changeSaleManagerPassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success("Đổi mật khẩu thành công");
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error("Không thể đổi mật khẩu");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Không thể tải thông tin profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và tài khoản</p>
        </CardContent>
      </Card>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar?.url} alt={user.fullName || user.username} />
                <AvatarFallback className="text-2xl">
                  {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{user.fullName || user.username}</h2>
                <Badge className="bg-green-100 text-green-800">
                  Hoạt động
                </Badge>
              </div>
              <p className="text-lg text-gray-600 mb-1">{user.position || 'Sale Manager'}</p>
              <p className="text-sm text-gray-500">{user.department || 'Sales'} • {user.team || 'Management'}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Tham gia: {new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Email: {user.email}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowChangePassword(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Đổi mật khẩu
              </Button>
              <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu hiện tại
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu mới
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowChangePassword(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Đổi mật khẩu
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đơn hàng</p>
                <p className="text-2xl font-semibold text-gray-900">{user.stats?.totalOrders || 0}</p>
                <p className="text-sm text-green-600">+{user.stats?.completedOrders || 0} hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(user.stats?.totalRevenue || 0).toLocaleString('vi-VN')}đ
                </p>
                <p className="text-sm text-green-600">+12% tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đánh giá</p>
                <p className="text-2xl font-semibold text-gray-900">{(user.stats?.averageRating || 0).toFixed(1)}/5</p>
                <p className="text-sm text-green-600">+0.2 tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              {isEditing ? (
                <Input
                  value={editForm.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{user.fullName || user.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              {isEditing ? (
                <Input
                  value={editForm.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              {isEditing ? (
                <Textarea
                  value={editForm.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                />
              ) : (
                <p className="text-gray-900">{user.address || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới thiệu
              </label>
              {isEditing ? (
                <Textarea
                  value={editForm.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="text-gray-900">{user.bio || 'Chưa cập nhật'}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin công việc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vị trí
              </label>
              <p className="text-gray-900">{user.position || 'Sale Manager'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban
              </label>
              <p className="text-gray-900">{user.department || 'Sales'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team
              </label>
              <p className="text-gray-900">{user.team || 'Management'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quản lý bởi
              </label>
              <p className="text-gray-900">{user.manager || 'Admin'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày tham gia
              </label>
              <p className="text-gray-900">
                {new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <Badge className="bg-green-100 text-green-800">
                Hoạt động
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <Card>
        <CardContent className="p-6">
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 