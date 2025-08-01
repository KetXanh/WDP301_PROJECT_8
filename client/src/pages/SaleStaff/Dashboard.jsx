import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  ShoppingCart, 
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  UserCheck,
  UserX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDashboardData, getAnalytics, getTaskAssignment, updateTaskAssignment } from '@/services/SaleStaff/ApiSaleStaff';
import DashboardStats from './Components/DashboardStats';
import TaskProgress from './Components/TaskProgress';
import KPIAchievement from './Components/KPIAchievement';
import TaskTable from './Components/TaskTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [timeRange, setTimeRange] = useState('month');
  const [chartData, setChartData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({ status: '', progress: '', notes: '' });
  const [filter, setFilter] = useState('all');
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchStatistics(timeRange);
    fetchTasks();
  }, [timeRange]);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardData();
      
      setStats(res.data.data.stats || {});
      setRecentTasks(res.data.data.recentTasks || []);
      setRecentOrders(res.data.data.recentOrders || []);
    } catch {
      toast.error('Không thể tải dữ liệu dashboard');
    }
  };

  const fetchStatistics = async (period) => {
    try {
      const res = await getAnalytics(period);
      setChartData(res.data.data.chartData || {});
    } catch {
      toast.error('Không thể tải dữ liệu thống kê');
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTaskAssignment();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Không thể tải danh sách task');
    }
    setLoading(false);
  };

  const handleViewTask = (task) => { setSelectedTask(task); setShowDetailModal(true); };
  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setUpdateForm({
      status: task.status,
      progress: (task.task?.progress || 0).toString(),
      notes: task.notes || ''
    });
    setShowUpdateModal(true);
  };
  const handleSubmitUpdate = async () => {
    try {
      await updateTaskAssignment(selectedTask._id, { status: updateForm.status });
      toast.success('Cập nhật task thành công');
      setShowUpdateModal(false);
      fetchTasks();
    } catch {
      toast.error('Không thể cập nhật task');
    }
  };

  const completedTasks = tasks.filter(item => item.status === 'done');

  if (!stats) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

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
      <div className="flex flex-col items-center justify-center w-full my-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
          <Card className="flex items-center gap-6 p-8 rounded-3xl shadow-2xl bg-gradient-to-tr from-blue-100 to-blue-50 border-0 w-full">
            <div className="bg-blue-200 p-6 rounded-full shadow-lg">
              <ShoppingCart className="text-blue-600 w-14 h-14" />
            </div>
            <div>
              <div className="text-4xl font-extrabold text-blue-700">{stats.orderCount ?? 0}</div>
              <div className="text-lg text-gray-500 font-semibold mt-2">Đơn hàng</div>
            </div>
          </Card>
          <Card className="flex items-center gap-6 p-8 rounded-3xl shadow-2xl bg-gradient-to-tr from-green-100 to-green-50 border-0 w-full">
            <div className="bg-green-200 p-6 rounded-full shadow-lg">
              <ClipboardList className="text-green-600 w-14 h-14" />
            </div>
            <div>
              <div className="text-4xl font-extrabold text-green-700">{stats.taskCount ?? 0}</div>
              <div className="text-lg text-gray-500 font-semibold mt-2">Task</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Thống kê & Bộ lọc thời gian */}
      <Card className="rounded-2xl shadow bg-white border-0 mt-6">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
            <p className="text-gray-600">Tổng quan hiệu suất làm việc</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-gray-400" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36 h-10 text-base">
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
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <TaskProgress chartData={chartData} />
      </div>

      {/* Recent Tasks & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        {/* Recent Tasks */}
        <Card className="rounded-2xl shadow-xl border-0 p-0">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-bold">Task gần đây</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {recentTasks.length === 0 ? (
              <div className="text-gray-500">Không có task gần đây</div>
            ) : (
              <ul className="space-y-6">
                {recentTasks.map((item) => (
                  <li key={item._id} className="p-4 bg-gray-50 rounded-xl shadow flex flex-col gap-2 hover:bg-blue-50 transition">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-7 h-7 text-blue-500" />
                      <span className="font-semibold text-lg text-blue-900">{item.task?.title}</span>
                      <Badge variant={item.status === 'done' ? 'success' : item.status === 'pending' ? 'secondary' : item.status === 'late' ? 'destructive' : 'outline'} className="text-xs px-2 py-1">
                        {item.status === 'done' ? 'Hoàn thành' : item.status === 'pending' ? 'Chờ bắt đầu' : item.status === 'late' ? 'Quá hạn' : 'Đang thực hiện'}
                      </Badge>
                      <Button size="sm" className="ml-auto" onClick={() => handleUpdateTask(item)}>Cập nhật</Button>
                    </div>
                    <div className="text-sm text-gray-600 pl-10">{item.task?.description}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 pl-10 items-center">
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4" />Deadline: <span className="font-medium">{item.deadline ? new Date(item.deadline).toLocaleDateString('vi-VN') : ''}</span></div>
                      <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />Tiến độ: <span className="font-medium">{item.task?.progress || 0}%</span></div>
                      <div className="flex items-center gap-1"><UserCheck className="w-4 h-4" />Giao bởi: <span className="font-medium">{item.assignedBy?.username || item.assignedBy}</span></div>
                      <div className="flex items-center gap-1"><UserX className="w-4 h-4" />Giao cho: <span className="font-medium">{item.assignedTo?.username || item.assignedTo}</span></div>
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />Ngày giao: <span className="font-medium">{item.assignedAt ? new Date(item.assignedAt).toLocaleDateString('vi-VN') : ''}</span></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${item.task?.progress || 0}%` }}></div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        {/* Recent Orders */}
        <Card className="rounded-2xl shadow-xl border-0 p-0">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-bold">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {recentOrders.length === 0 ? (
              <div className="text-gray-500">Không có đơn hàng gần đây</div>
            ) : (
              <ul className="space-y-6">
                {recentOrders.map((item) => (
                  <li key={item._id} className="p-4 bg-gray-50 rounded-xl shadow flex flex-col gap-2 hover:bg-green-50 transition">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-7 h-7 text-green-500" />
                      <span className="font-semibold text-lg text-green-900">Mã đơn: {item.orderId?._id || item.orderId}</span>
                      <Badge variant={item.status === 'delivered' ? 'success' : item.status === 'pending' ? 'secondary' : item.status === 'cancelled' ? 'destructive' : 'outline'} className="text-xs px-2 py-1">
                        {item.status === 'delivered' ? 'Đã giao' : item.status === 'pending' ? 'Chờ xử lý' : item.status === 'cancelled' ? 'Đã hủy' : item.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 pl-10 items-center">
                      <div className="flex items-center gap-1"><UserCheck className="w-4 h-4" />Giao bởi: <span className="font-medium">{item.assignedBy?.username || item.assignedBy}</span></div>
                      <div className="flex items-center gap-1"><UserX className="w-4 h-4" />Giao cho: <span className="font-medium">{item.assignedTo?.username || item.assignedTo}</span></div>
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />Ngày giao: <span className="font-medium">{item.assignedAt ? new Date(item.assignedAt).toLocaleDateString('vi-VN') : ''}</span></div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        {/* Completed Tasks */}
        <Card className="rounded-2xl shadow-xl border-0 p-0">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-bold">Task hoàn thành</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {completedTasks.length === 0 ? (
              <div className="text-gray-500">Không có task hoàn thành</div>
            ) : (
              <ul className="space-y-6">
                {completedTasks.map((item) => (
                  <li key={item._id} className="p-4 bg-gray-50 rounded-xl shadow flex flex-col gap-2 hover:bg-blue-50 transition">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-7 h-7 text-blue-500" />
                      <span className="font-semibold text-lg text-blue-900">{item.task?.title}</span>
                      <Badge variant="success" className="text-xs px-2 py-1">Hoàn thành</Badge>
                      <Button size="sm" className="ml-auto" onClick={() => handleUpdateTask(item)}>Cập nhật</Button>
                    </div>
                    <div className="text-sm text-gray-600 pl-10">{item.task?.description}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 pl-10 items-center">
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4" />Deadline: <span className="font-medium">{item.deadline ? new Date(item.deadline).toLocaleDateString('vi-VN') : ''}</span></div>
                      <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />Tiến độ: <span className="font-medium">{item.task?.progress || 0}%</span></div>
                      <div className="flex items-center gap-1"><UserCheck className="w-4 h-4" />Giao bởi: <span className="font-medium">{item.assignedBy?.username || item.assignedBy}</span></div>
                      <div className="flex items-center gap-1"><UserX className="w-4 h-4" />Giao cho: <span className="font-medium">{item.assignedTo?.username || item.assignedTo}</span></div>
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />Ngày giao: <span className="font-medium">{item.assignedAt ? new Date(item.assignedAt).toLocaleDateString('vi-VN') : ''}</span></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${item.task?.progress || 0}%` }}></div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={tasks}
        loading={loading}
        filter={filter}
        setFilter={setFilter}
        onView={handleViewTask}
        onUpdate={handleUpdateTask}
      />

      {/* Task Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin task</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Tiêu đề:</span> {selectedTask.task?.title}</p>
                    <p><span className="font-medium">Mô tả:</span> {selectedTask.task?.description}</p>
                    <p><span className="font-medium">Trạng thái:</span>
                      <span className="ml-2 font-semibold">{selectedTask.status}</span>
                    </p>
                    <p><span className="font-medium">Ưu tiên:</span>
                      <span className="ml-2 font-semibold">{selectedTask.task?.priority || 'medium'}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khác</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Được giao bởi:</span> {selectedTask.assignedBy?.username || selectedTask.assignedBy}</p>
                    <p><span className="font-medium">Được giao cho:</span> {selectedTask.assignedTo?.username || selectedTask.assignedTo}</p>
                    <p><span className="font-medium">Ngày tạo task:</span> {selectedTask.task?.createdAt ? new Date(selectedTask.task.createdAt).toLocaleDateString('vi-VN') : ''}</p>
                    <p><span className="font-medium">Ngày được giao:</span> {selectedTask.assignedAt ? new Date(selectedTask.assignedAt).toLocaleDateString('vi-VN') : ''}</p>
                    <p><span className="font-medium">Hạn chót:</span> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString('vi-VN') : ''}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tiến độ</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tiến độ hiện tại</span>
                    <span className="text-sm font-medium">{selectedTask.task?.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${selectedTask.task?.progress || 0}%` }}></div>
                  </div>
                </div>
              </div>
              {selectedTask.notes && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ghi chú:</span> {selectedTask.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật tiến độ task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <Select value={updateForm.status} onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ bắt đầu</SelectItem>
                  <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                  <SelectItem value="done">Hoàn thành</SelectItem>
                  <SelectItem value="late">Quá hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiến độ (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={updateForm.progress}
                onChange={(e) => setUpdateForm({ ...updateForm, progress: e.target.value })}
                placeholder="Nhập tiến độ từ 0-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <Textarea
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                placeholder="Thêm ghi chú về tiến độ task..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>Hủy</Button>
            <Button onClick={handleSubmitUpdate}>Cập nhật</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard; 