import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  ShoppingCart, 
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasks: {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0
    },
    kpis: {
      active: 0,
      achieved: 0
    },
    orders: {
      total: 0,
      completed: 0,
      pending: 0,
      revenue: 0
    }
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    // fetchDashboardData();
    
    // Mock data for now
    setStats({
      tasks: {
        total: 15,
        completed: 8,
        pending: 4,
        inProgress: 3
      },
      kpis: {
        active: 5,
        achieved: 2
      },
      orders: {
        total: 25,
        completed: 18,
        pending: 5,
        revenue: 15000000
      }
    });

    setRecentTasks([
      { id: 1, title: 'Liên hệ khách hàng ABC', status: 'completed', priority: 'high' },
      { id: 2, title: 'Chuẩn bị báo cáo tháng', status: 'in_progress', priority: 'medium' },
      { id: 3, title: 'Gửi proposal cho dự án XYZ', status: 'pending', priority: 'high' }
    ]);

    setRecentOrders([
      { id: 1, customer: 'Công ty ABC', amount: 5000000, status: 'completed' },
      { id: 2, customer: 'Công ty XYZ', amount: 3000000, status: 'pending' },
      { id: 3, customer: 'Công ty DEF', amount: 7000000, status: 'in_progress' }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại!
          </h1>
          <p className="text-gray-600">
            Đây là tổng quan hoạt động của bạn hôm nay
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tasks Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Task</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks.total}</div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span className="text-green-600">Hoàn thành: {stats.tasks.completed}</span>
              <span className="text-yellow-600">Đang làm: {stats.tasks.inProgress}</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KPI</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.kpis.active}</div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span className="text-green-600">Đạt được: {stats.kpis.achieved}</span>
              <span className="text-blue-600">Đang theo dõi: {stats.kpis.active - stats.kpis.achieved}</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total}</div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span className="text-green-600">Hoàn thành: {stats.orders.completed}</span>
              <span className="text-yellow-600">Chờ xử lý: {stats.orders.pending}</span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.orders.revenue.toLocaleString('vi-VN')}đ
            </div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% so với tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Task gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">
                        {order.amount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 