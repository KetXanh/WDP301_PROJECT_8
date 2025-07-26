import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Users, UserPlus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TaskForm } from "./components/TaskForm"
import { TaskAssignmentForm } from "./components/TaskAssignmentForm"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getAllTasks, createTask, updateTask, deleteTask, getAllSaleStaff, createTaskAssignment, getAssignedTasks, removeTaskAssignment, getTaskStats, assignUnassignedTasksToAllStaff } from "@/services/SaleManager/ApiSaleManager"
import TaskStaffFilter from "./components/TaskStaffFilter"

export default function ManagerTask() {
  const [tasks, setTasks] = useState([])
  const [saleStaff, setSaleStaff] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isAssignAllDialogOpen, setIsAssignAllDialogOpen] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState('all')
  const [assignments, setAssignments] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    lateTasks: 0,
    completionRate: 0,
    upcomingDeadlines: 0,
    statusStats: {},
    monthlyStats: [],
    topAssignedTasks: [],
    creatorStats: [],
    totalAssignments: 0,
    averageAssignmentsPerTask: 0,
    multiAssignedTasks: 0
  })

  useEffect(() => {
    fetchTasks()
    fetchSaleStaff()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await getTaskStats()
      if (res.data?.data) {
        setStats(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    if (selectedStaffId === 'all') {
      fetchTasks();
      setAssignments([]);
    } else {
      fetchAssignments(selectedStaffId);
    }
  }, [selectedStaffId]);

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks()
      // Sử dụng cấu trúc API response thực tế
      const tasksData = res.data.data || []
      setTasks(tasksData)
    } catch {
      toast.error("Không thể tải danh sách task")
    }
  }

  const fetchSaleStaff = async () => {
    try {
      const res = await getAllSaleStaff()
      // Lấy đúng cấu trúc API mới
      let staffData = res.data.data || []
      if (!Array.isArray(staffData)) staffData = [];
      setSaleStaff(staffData)
    } catch {
      setSaleStaff([])
      toast.error("Không thể tải danh sách nhân viên")
    }
  }

  const fetchAssignments = async (staffId) => {
    try {
      const res = await getAssignedTasks(staffId);
      setAssignments(res.data.data || []);
    } catch {
      setAssignments([]);
      toast.error("Không thể tải danh sách phân công");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'late':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ thực hiện'
      case 'in-progress':
        return 'Đang thực hiện'
      case 'completed':
        return 'Hoàn thành'
      case 'late':
        return 'Quá hạn'
      default:
        return 'Không xác định'
    }
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsFormOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsFormOpen(true)
  }

  const handleDeleteTask = (task) => {
    setTaskToDelete(task)
    setIsDeleteDialogOpen(true)
  }

  const handleAssignTask = (task) => {
    setSelectedTask(task)
    setIsAssignmentFormOpen(true)
  }

  const handleAssignToAll = async () => {
    try {
      const res = await assignUnassignedTasksToAllStaff();
      if (res.data?.code === 201) {
        toast.success(res.data.message);
        fetchTasks();
        fetchStats(); // Cập nhật thống kê sau khi giao việc
      } else {
        // Hiển thị thông tin debug nếu có
        const debugInfo = res.data?.debug;
        const message = res.data?.message || "Có lỗi xảy ra khi giao việc";
        if (debugInfo) {
          console.log('Debug info:', debugInfo);
          toast.error(`${message} (Debug: ${JSON.stringify(debugInfo)})`);
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      console.error('Error assigning tasks to all staff:', error);
      toast.error("Không thể giao việc cho tất cả nhân viên");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(taskToDelete._id)
      toast.success("Xóa công việc thành công")
      fetchTasks()
    } catch {
      toast.error("Không thể xóa công việc")
    }
    setIsDeleteDialogOpen(false)
  }

  const handleSubmit = async (data) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, data)
        toast.success("Cập nhật công việc thành công")
      } else {
        await createTask(data)
        toast.success("Thêm công việc mới thành công")
      }
      fetchTasks()
      fetchStats() // Cập nhật thống kê sau khi thay đổi
    } catch {
      toast.error("Không thể lưu công việc")
    }
    setIsFormOpen(false)
  }

  const handleAssignmentSubmit = async (data) => {
    try {
      await createTaskAssignment({
        taskId: selectedTask._id,
        assignedTo: data.assignedTo,
        notes: data.notes,
        deadline: selectedTask.deadline
      })
      toast.success("Đã gán công việc cho nhân viên được chọn")
      fetchTasks()
      fetchStats() // Cập nhật thống kê sau khi gán
    } catch {
      toast.error("Không thể gán công việc")
    }
    setIsAssignmentFormOpen(false)
  }

  const handleRemoveAssignment = async (task) => {
    if (!task) return;
    // Nếu đang filter theo sale staff, dùng assignmentId, còn lại dùng task._id
    const idToRemove = selectedStaffId === 'all' ? task._id : task.assignmentId;
    try {
      await removeTaskAssignment(idToRemove);
      toast.success("Đã hủy gán công việc cho nhân viên!");
      if (selectedStaffId === 'all') fetchTasks();
      else fetchAssignments(selectedStaffId);
      fetchStats() // Cập nhật thống kê sau khi hủy gán
    } catch {
      toast.error("Không thể hủy gán công việc!");
    }
  }

  const filteredTasks = selectedStaffId === 'all'
    ? tasks
    : assignments.map(a => ({ ...a.task, assignmentId: a._id, assignment: a }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý công việc</h2>
          <p className="text-muted-foreground">
            Danh sách các công việc và phân công
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <TaskStaffFilter
            saleStaff={saleStaff}
            selectedStaffId={selectedStaffId}
            onChange={setSelectedStaffId}
          />
          <Button variant="outline" onClick={handleAssignToAll}>
            <UserPlus className="mr-2 h-4 w-4" />
            Giao cho tất cả
          </Button>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm công việc mới
          </Button>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng công việc</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sắp đến hạn</p>
              <p className="text-2xl font-bold text-orange-600">{stats.upcomingDeadlines}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-3">Thống kê theo trạng thái</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Chờ xử lý</span>
              <span className="font-medium text-gray-800">{stats.pendingTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Đang thực hiện</span>
              <span className="font-medium text-blue-600">{stats.inProgressTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Đã hoàn thành</span>
              <span className="font-medium text-green-600">{stats.completedTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Trễ hạn</span>
              <span className="font-medium text-red-600">{stats.lateTasks}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-3">Thống kê phân công</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tổng phân công</span>
              <span className="font-medium text-blue-600">{stats.totalAssignments || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">TB phân công/task</span>
              <span className="font-medium text-purple-600">{stats.averageAssignmentsPerTask || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Task nhiều người</span>
              <span className="font-medium text-orange-600">{stats.multiAssignedTasks || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-3">Top người tạo</h3>
          <div className="space-y-2">
            {stats.creatorStats?.slice(0, 3).map((creator) => (
              <div key={creator._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{creator.creatorName}</span>
                <span className="font-medium">{creator.taskCount} việc</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-3">Top task được gán</h3>
          <div className="space-y-2">
            {stats.topAssignedTasks?.slice(0, 3).map((task) => (
              <div key={task._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate">{task.title}</span>
                <span className="font-medium">{task.assignmentCount} lần</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Hạn chót</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Đã giao cho</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                <TableCell>
                  {task.deadline ? (
                    new Date(task.deadline).toLocaleDateString('vi-VN')
                  ) : task.dueDate ? (
                    new Date(task.dueDate).toLocaleDateString('vi-VN')
                  ) : (
                    <span className="text-gray-400">Chưa có</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(task.progress)}`}
                        style={{ width: `${task.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{task.progress || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </TableCell>
                <TableCell>
                  {task.assignments && task.assignments.length > 0 ? (
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {task.assignments.slice(0, 3).map((assignment, index) => {
                          const assignedTo = assignment.assignedTo;
                          const username = typeof assignedTo === 'object' ? assignedTo.username : assignedTo;
                          return (
                            <span 
                              key={assignment._id || index} 
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                              title={username}
                            >
                              {username || 'Unknown'}
                            </span>
                          );
                        })}
                        {task.assignmentCount > 3 && (
                          <span 
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs cursor-pointer"
                            title={`Xem thêm ${task.assignmentCount - 3} người khác`}
                          >
                            +{task.assignmentCount - 3}
                          </span>
                        )}
                      </div>
                      {task.assignmentCount > 3 && (
                        <details className="text-xs text-gray-500">
                          <summary className="cursor-pointer hover:text-gray-700">
                            Xem tất cả ({task.assignmentCount} người)
                          </summary>
                          <div className="mt-1 space-y-1">
                            {task.assignments.slice(3).map((assignment, index) => {
                              const assignedTo = assignment.assignedTo;
                              const username = typeof assignedTo === 'object' ? assignedTo.username : assignedTo;
                              return (
                                <div key={assignment._id || index + 3} className="text-gray-600">
                                  • {username || 'Unknown'}
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Chưa giao</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.createdBy ? (
                    <div className="text-sm">
                      <div className="font-medium">{task.createdBy.username}</div>
                      <div className="text-gray-500 text-xs">{task.createdBy.email}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {selectedStaffId === 'all' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTask(task)}
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAssignTask(task)}
                          title="Giao việc"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTask(task)}
                          title="Cập nhật"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAssignment(task)}
                          title="Hủy gán"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedTask}
      />

      <TaskAssignmentForm
        open={isAssignmentFormOpen}
        onOpenChange={setIsAssignmentFormOpen}
        onSubmit={handleAssignmentSubmit}
        task={selectedTask}
        saleStaff={Array.isArray(saleStaff) ? saleStaff : []}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isAssignAllDialogOpen} onOpenChange={setIsAssignAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận giao việc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn gán tất cả công việc đang chờ cho tất cả nhân viên? 
              Hành động này sẽ gán tất cả công việc chưa được giao cho mọi nhân viên.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleAssignToAll}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

