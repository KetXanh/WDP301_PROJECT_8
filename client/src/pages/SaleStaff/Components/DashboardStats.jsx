import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

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
          ) : null}
          <span className={`text-sm ml-1 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const DashboardStats = ({ stats, chartData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard title="Tổng Task" value={stats?.taskCount || 0} change="+12%" changeType="increase" icon={BarChart3} />
    <StatCard title="Task hoàn thành" value={chartData?.tasks?.completed || 0} change="+8%" changeType="increase" icon={TrendingUp} />
    <StatCard title="Tổng Đơn hàng" value={stats?.orderCount || 0} change="+5%" changeType="increase" icon={ShoppingCart} />
    <StatCard title="Doanh thu" value={`${chartData?.orders?.revenue?.toLocaleString('vi-VN') || 0}đ`} change="+15%" changeType="increase" icon={DollarSign} />
  </div>
);

export default DashboardStats; 