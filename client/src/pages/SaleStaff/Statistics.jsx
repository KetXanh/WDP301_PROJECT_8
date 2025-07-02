import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAnalytics, getSalesAnalytics } from '@/services/SaleStaff/ApiSaleStaff';
import { toast } from 'sonner';

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchStatistics(timeRange);
  }, [timeRange]);

  const fetchStatistics = async (period) => {
    try {
      const res = await getAnalytics(period);
      setStats(res.data.stats || {});
      setChartData(res.data.chartData || {});
    } catch (error) {
      toast.error('Không thể tải dữ liệu thống kê');
    }
  };

  const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center mt-2">
            {changeType === 'increase' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ml-1 ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ProgressBar = ({ percentage, color = 'bg-blue-500' }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`${color} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
              <p className="text-gray-600">Tổng quan hiệu suất làm việc</p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Task"
          value={stats?.tasks?.total || 0}
          change="+12%"
          changeType="increase"
          icon={BarChart3}
        />
        <StatCard
          title="Task hoàn thành"
          value={stats?.tasks?.completed || 0}
          change="+8%"
          changeType="increase"
          icon={TrendingUp}
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${stats?.tasks?.completionRate || 0}%`}
          change="+5%"
          changeType="increase"
          icon={TrendingUp}
        />
        <StatCard
          title="Doanh thu"
          value={`${stats?.orders?.revenue?.toLocaleString('vi-VN') || 0}đ`}
          change="+15%"
          changeType="increase"
          icon={DollarSign}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData?.taskProgress?.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.value}</span>
                  </div>
                  <ProgressBar 
                    percentage={(item.value / stats?.tasks?.total) * 100} 
                    color={item.color}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* KPI Achievement */}
        <Card>
          <CardHeader>
            <CardTitle>KPI Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">KPI đạt được</span>
                <span className="text-sm text-gray-500">{stats?.kpis?.achieved}/{stats?.kpis?.active}</span>
              </div>
              <ProgressBar 
                percentage={stats?.kpis?.achievementRate || 0} 
                color="bg-purple-500"
              />
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats?.kpis?.achievementRate || 0}%</p>
                <p className="text-sm text-gray-500">Tỷ lệ đạt KPI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {chartData?.orderTrend?.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700">{item.month}</p>
                  <p className="text-lg font-bold text-blue-600">{item.orders}</p>
                  <p className="text-xs text-gray-500">
                    {item.revenue.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Details */}
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tổng số task</span>
                <span className="text-sm font-medium">{stats?.tasks?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Đã hoàn thành</span>
                <span className="text-sm font-medium text-green-600">{stats?.tasks?.completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Đang thực hiện</span>
                <span className="text-sm font-medium text-blue-600">{stats?.tasks?.inProgress || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Chờ xử lý</span>
                <span className="text-sm font-medium text-yellow-600">{stats?.tasks?.pending || 0}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tỷ lệ hoàn thành</span>
                <span className="text-sm font-bold text-green-600">{stats?.tasks?.completionRate || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tổng đơn hàng</span>
                <span className="text-sm font-medium">{stats?.orders?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Đã hoàn thành</span>
                <span className="text-sm font-medium text-green-600">{stats?.orders?.completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Chờ xử lý</span>
                <span className="text-sm font-medium text-yellow-600">{stats?.orders?.pending || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giá trị trung bình</span>
                <span className="text-sm font-medium">{stats?.orders?.averageOrderValue?.toLocaleString('vi-VN') || 0}đ</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tổng doanh thu</span>
                <span className="text-sm font-bold text-green-600">{stats?.orders?.revenue?.toLocaleString('vi-VN') || 0}đ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics; 