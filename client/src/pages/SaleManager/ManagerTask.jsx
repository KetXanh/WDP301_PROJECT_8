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
import { getAllTasks, createTask, updateTask, deleteTask, getAllSaleStaff, createTaskAssignment } from "@/services/SaleManager/ApiSaleManager"

export default function ManagerTask() {
  const [tasks, setTasks] = useState([])
  const [saleStaff, setSaleStaff] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isAssignAllDialogOpen, setIsAssignAllDialogOpen] = useState(false)

  useEffect(() => {
    fetchTasks()
    fetchSaleStaff()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks()
      // Sử dụng cấu trúc API response thực tế
      const tasksData = res.data.tasks || []
      setTasks(tasksData)
    } catch {
      toast.error("Không thể tải danh sách task")
    }
  }

  const fetchSaleStaff = async () => {
    try {
      const res = await getAllSaleStaff()
      // Handle different possible response structures
      const staffData = res.data?.users || res.data || []
      setSaleStaff(staffData)
    } catch {
      toast.error("Không thể tải danh sách nhân viên")
    }
  }

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
    // Lấy danh sách task chưa giao
    const unassignedTasks = tasks.filter(task => !task.assignedTo || (Array.isArray(task.assignedTo) && task.assignedTo.length === 0));
    if (unassignedTasks.length === 0 || saleStaff.length === 0) {
      toast.error("Không có công việc hoặc nhân viên để giao việc");
      return;
    }
    let successCount = 0;
    let failCount = 0;
    for (let task of unassignedTasks) {
      for (let staff of saleStaff) {
        try {
          await createTaskAssignment({ taskId: task._id, assignedTo: [staff._id] });
          successCount++;
        } catch {
          failCount++;
        }
      }
    }
    fetchTasks();
    if (successCount > 0) toast.success(`Đã giao thành công ${successCount} công việc!`);
    if (failCount > 0) toast.error(`${failCount} công việc không thể giao!`);
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
    } catch {
      toast.error("Không thể lưu công việc")
    }
    setIsFormOpen(false)
  }

  const handleAssignmentSubmit = async (data) => {
    try {
      await createTaskAssignment({ taskId: selectedTask._id, assignedTo: data.selectedStaff, notes: data.notes })
      toast.success("Đã gán công việc cho nhân viên được chọn")
      fetchTasks()
    } catch {
      toast.error("Không thể gán công việc")
    }
    setIsAssignmentFormOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý công việc</h2>
          <p className="text-muted-foreground">
            Danh sách các công việc và phân công
          </p>
        </div>
        <div className="flex gap-2">
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
            {tasks.map((task) => (
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
                  {task.assignedTo ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {task.assignedTo}
                    </span>
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
                      onClick={() => handleEditTask(task)}
                      title="Chỉnh sửa"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task)}
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
        saleStaff={saleStaff}
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

