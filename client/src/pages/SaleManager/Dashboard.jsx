import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { DollarSign, ShoppingCart, Users, Package, ClipboardList } from "lucide-react"
import { overview } from "@/services/SaleManager/ApiSaleManager";
import { toast } from "sonner";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await overview();
      const statsData = res.data?.data || {};
      // Tính tổng doanh thu nếu chưa có
      if (statsData.orders && (statsData.orders.totalRevenue === undefined || statsData.orders.totalRevenue === null)) {
        statsData.orders.totalRevenue = Array.isArray(statsData.orders.statusStats)
          ? statsData.orders.statusStats.reduce((sum, s) => sum + (s.revenue || 0), 0)
          : 0;
      }
      setStats(statsData);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Không thể tải dữ liệu dashboard");
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chào mừng trở lại!</h2>
        <p className="text-muted-foreground">
          Đây là trang quản lý cửa hàng của bạn
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Tổng số đơn hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.orders?.totalRevenue || 0).toLocaleString('vi-VN')}₫</div>
            <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng task</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tasks?.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground">Tổng số công việc</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Tổng số người dùng</p>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê trạng thái đơn hàng */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.orders?.statusStats?.map((status, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="capitalize">{status._id}</span>
                  <span className="font-bold">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.tasks?.statusStats?.map((status, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="capitalize">{status._id}</span>
                  <span className="font-bold">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê người dùng theo vai trò */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố người dùng theo vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats?.users?.roleStats?.map((role, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="capitalize">{role._id === 0 ? 'Khách hàng' : role._id === 1 ? 'Admin' : role._id === 2 ? 'Sale Manager' : role._id === 3 ? 'Product Manager' : role._id === 4 ? 'Sale Staff' : `Role ${role._id}`}</span>
                <span className="font-bold">{role.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 