import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Edit,
  Filter,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    progress: '',
    notes: ''
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch tasks from API
    // fetchTasks();
    
    // Mock data
    setTasks([
      {
        id: 1,
        title: 'Liên hệ khách hàng ABC',
        description: 'Gọi điện và tư vấn sản phẩm cho khách hàng ABC',
        status: 'completed',
        priority: 'high',
        progress: 100,
        assignedBy: 'Manager A',
        assignedTo: 'Sale Staff 1',
        deadline: '2024-01-25',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22',
        notes: 'Đã liên hệ thành công, khách hàng quan tâm đến sản phẩm A'
      },
      {
        id: 2,
        title: 'Chuẩn bị báo cáo tháng',
        description: 'Tổng hợp báo cáo doanh số và KPI tháng 1',
        status: 'in_progress',
        priority: 'medium',
        progress: 60,
        assignedBy: 'Manager B',
        assignedTo: 'Sale Staff 1',
        deadline: '2024-01-31',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-23',
        notes: 'Đã thu thập 60% dữ liệu, cần hoàn thiện phần phân tích'
      },
      {
        id: 3,
        title: 'Gửi proposal cho dự án XYZ',
        description: 'Chuẩn bị và gửi proposal chi tiết cho dự án XYZ',
        status: 'pending',
        priority: 'high',
        progress: 0,
        assignedBy: 'Manager A',
        assignedTo: 'Sale Staff 1',
        deadline: '2024-01-28',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18',
        notes: 'Chờ thông tin chi tiết từ khách hàng để hoàn thiện proposal'
      },
      {
        id: 4,
        title: 'Tham gia hội thảo sản phẩm',
        description: 'Tham gia hội thảo giới thiệu sản phẩm mới',
        status: 'completed',
        priority: 'low',
        progress: 100,
        assignedBy: 'Manager C',
        assignedTo: 'Sale Staff 1',
        deadline: '2024-01-20',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-20',
        notes: 'Hội thảo diễn ra thành công, thu thập được nhiều lead tiềm năng'
      },
      {
        id: 5,
        title: 'Cập nhật CRM',
        description: 'Cập nhật thông tin khách hàng và tương tác trong CRM',
        status: 'in_progress',
        priority: 'medium',
        progress: 30,
        assignedBy: 'Manager B',
        assignedTo: 'Sale Staff 1',
        deadline: '2024-01-30',
        createdAt: '2024-01-22',
        updatedAt: '2024-01-24',
        notes: 'Đã cập nhật 30% thông tin, cần tiếp tục với các khách hàng còn lại'
      }
    ]);
    setLoading(false);
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
        return <CheckCircle className="h-5 w-5" />;
      case 'in_progress':
        return <Clock className="h-5 w-5" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'in_progress':
        return 'Đang thực hiện';
      case 'pending':
        return 'Chờ bắt đầu';
      default:
        return 'Không xác định';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return 'Không xác định';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setUpdateForm({
      status: task.status,
      progress: task.progress.toString(),
      notes: task.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = () => {
    // TODO: Submit update to API
    const updatedTask = {
      ...selectedTask,
      status: updateForm.status,
      progress: parseInt(updateForm.progress),
      notes: updateForm.notes,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
    setShowUpdateModal(false);
    setSelectedTask(null);
    setUpdateForm({ status: '', progress: '', notes: '' });
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  const ProgressBar = ({ percentage, color = 'bg-blue-500' }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`${color} h-2 rounded-full transition-all duration-300 ${
          percentage >= 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
        }`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task của tôi</h1>
              <p className="text-gray-600">Quản lý và cập nhật tiến độ task</p>
            </div>
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {stats.completed}/{stats.total} task hoàn thành
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng task</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hoàn thành</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đang thực hiện</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Chờ bắt đầu</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ưu tiên cao</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.highPriority}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả task</SelectItem>
                <SelectItem value="pending">Chờ bắt đầu</SelectItem>
                <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">
              {filteredTasks.length} task
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách task</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ưu tiên</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Hạn chót</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{getStatusText(task.status)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityText(task.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <ProgressBar percentage={task.progress} />
                      <span className="text-sm text-gray-500">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(task.deadline).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTask(task)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateTask(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                    <p><span className="font-medium">Tiêu đề:</span> {selectedTask.title}</p>
                    <p><span className="font-medium">Mô tả:</span> {selectedTask.description}</p>
                    <p><span className="font-medium">Trạng thái:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedTask.status)}`}>
                        {getStatusText(selectedTask.status)}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Ưu tiên:</span> 
                      <Badge className={`ml-2 ${getPriorityColor(selectedTask.priority)}`}>
                        {getPriorityText(selectedTask.priority)}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khác</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Được giao bởi:</span> {selectedTask.assignedBy}</p>
                    <p><span className="font-medium">Được giao cho:</span> {selectedTask.assignedTo}</p>
                    <p><span className="font-medium">Ngày tạo:</span> {new Date(selectedTask.createdAt).toLocaleDateString('vi-VN')}</p>
                    <p><span className="font-medium">Hạn chót:</span> {new Date(selectedTask.deadline).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tiến độ</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tiến độ hiện tại</span>
                    <span className="text-sm font-medium">{selectedTask.progress}%</span>
                  </div>
                  <ProgressBar percentage={selectedTask.progress} />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <Select value={updateForm.status} onValueChange={(value) => setUpdateForm({...updateForm, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ bắt đầu</SelectItem>
                  <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiến độ (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={updateForm.progress}
                onChange={(e) => setUpdateForm({...updateForm, progress: e.target.value})}
                placeholder="Nhập tiến độ từ 0-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <Textarea
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                placeholder="Thêm ghi chú về tiến độ task..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmitUpdate}>
              Cập nhật
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks; 