import { useState } from "react"
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
import { toast } from "react-toastify"

// Mock data cho sale staff
const saleStaff = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com" },
  { id: 2, name: "Trần Thị B", email: "tranthib@example.com" },
  { id: 3, name: "Lê Văn C", email: "levanc@example.com" },
]

export default function ManagerTask() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Tìm kiếm khách hàng tiềm năng",
      description: "Tìm kiếm và liên hệ với khách hàng tiềm năng trong khu vực",
      deadline: "2024-05-30",
      priority: "high",
      status: "pending",
      assignedTo: ["Nguyễn Văn A"],
      assignedBy: "Trần Thị B",
      notes: "Ưu tiên khách hàng trong khu vực trung tâm"
    },
    {
      id: 2,
      title: "Báo cáo doanh số tháng 5",
      description: "Tổng hợp và phân tích doanh số bán hàng tháng 5",
      deadline: "2024-06-05",
      priority: "medium",
      status: "in-progress",
      assignedTo: ["Lê Văn C"],
      assignedBy: "Trần Thị B",
      notes: "Báo cáo chi tiết theo từng sản phẩm"
    }
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isAssignAllDialogOpen, setIsAssignAllDialogOpen] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const handleAssignToAll = () => {
    const pendingTasks = tasks.filter(task => task.status === 'pending')
    if (pendingTasks.length === 0) {
      toast.warning("Không có công việc nào đang chờ giao")
      return
    }
    setIsAssignAllDialogOpen(true)
  }

  const confirmAssignToAll = () => {
    const updatedTasks = tasks.map(task => {
      if (task.status === 'pending') {
        return {
          ...task,
          assignedTo: saleStaff.map(staff => staff.name)
        }
      }
      return task
    })
    setTasks(updatedTasks)
    toast.success("Đã gán tất cả công việc đang chờ cho nhân viên")
    setIsAssignAllDialogOpen(false)
  }

  const handleSubmit = (data) => {
    if (selectedTask) {
      // Update task
      setTasks(tasks.map(task => 
        task.id === selectedTask.id ? { ...task, ...data } : task
      ))
      toast.success("Cập nhật công việc thành công")
    } else {
      // Create new task
      const newTask = {
        id: tasks.length + 1,
        ...data,
        assignedTo: [],
        assignedBy: "Trần Thị B" // Mock data - sẽ thay bằng user thật
      }
      setTasks([...tasks, newTask])
      toast.success("Thêm công việc mới thành công")
    }
    setIsFormOpen(false)
  }

  const handleAssignmentSubmit = (data) => {
    const updatedTask = {
      ...selectedTask,
      assignedTo: data.selectedStaff,
      notes: data.notes
    }
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ))
    toast.success("Đã gán công việc cho nhân viên được chọn")
    setIsAssignmentFormOpen(false)
  }

  const confirmDelete = () => {
    setTasks(tasks.filter(task => task.id !== taskToDelete.id))
    setIsDeleteDialogOpen(false)
    toast.success("Xóa công việc thành công")
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
              <TableHead>Độ ưu tiên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Đã giao cho</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{new Date(task.deadline).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </TableCell>
                <TableCell>
                  {task.assignedTo.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {task.assignedTo.map((staff, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {staff}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Chưa giao</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">{task.notes}</TableCell>
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
            <AlertDialogAction onClick={confirmAssignToAll}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
