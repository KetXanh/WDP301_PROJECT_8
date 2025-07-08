import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Filter } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'done': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'late': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const getStatusIcon = (status) => {
  switch (status) {
    case 'done': return <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />;
    case 'in-progress': return <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1" />;
    case 'pending': return <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1" />;
    case 'late': return <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" />;
    default: return <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1" />;
  }
};
const getStatusText = (status) => {
  switch (status) {
    case 'done': return 'Hoàn thành';
    case 'in-progress': return 'Đang thực hiện';
    case 'pending': return 'Chờ bắt đầu';
    case 'late': return 'Quá hạn';
    default: return 'Không xác định';
  }
};
const getPriorityText = (priority) => {
  switch (priority) {
    case 'high': return 'Cao';
    case 'medium': return 'Trung bình';
    case 'low': return 'Thấp';
    default: return 'Không xác định';
  }
};
const ProgressBar = ({ percentage, color = 'bg-blue-500' }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className={`${color} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
  </div>
);

const TaskTable = ({ tasks, loading, filter, setFilter, onView, onUpdate }) => {
  const filteredTasks = tasks.filter(task => filter === 'all' ? true : task.status === filter);
  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả task</SelectItem>
            <SelectItem value="pending">Chờ bắt đầu</SelectItem>
            <SelectItem value="in-progress">Đang thực hiện</SelectItem>
            <SelectItem value="done">Hoàn thành</SelectItem>
            <SelectItem value="late">Quá hạn</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">{filteredTasks.length} task</span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
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
              <TableRow key={task._id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.task?.title}</div>
                    <div className="text-sm text-gray-500">{task.task?.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1">{getStatusText(task.status)}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.task?.priority || 'medium')}>
                    {getPriorityText(task.task?.priority || 'medium')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-24">
                    <ProgressBar percentage={task.task?.progress || 0} />
                    <span className="text-sm text-gray-500">{task.task?.progress || 0}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">
                  {new Date(task.deadline).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(task)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onUpdate(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TaskTable; 