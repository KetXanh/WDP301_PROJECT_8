import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { KPIForm } from "./components/KPIForm"
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

export default function ManagerKPI() {
  const [kpis, setKpis] = useState([
    {
      id: 1,
      staffName: "Nguyễn Văn A",
      target: 100000000,
      achieved: 85000000,
      completion: 85,
      status: "in-progress"
    },
    {
      id: 2,
      staffName: "Trần Thị B",
      target: 100000000,
      achieved: 120000000,
      completion: 120,
      status: "completed"
    }
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedKPI, setSelectedKPI] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [kpiToDelete, setKpiToDelete] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'not-started':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành'
      case 'in-progress':
        return 'Đang thực hiện'
      case 'not-started':
        return 'Chưa bắt đầu'
      default:
        return 'Không xác định'
    }
  }

  const handleCreateKPI = () => {
    setSelectedKPI(null)
    setIsFormOpen(true)
  }

  const handleEditKPI = (kpi) => {
    setSelectedKPI(kpi)
    setIsFormOpen(true)
  }

  const handleDeleteKPI = (kpi) => {
    setKpiToDelete(kpi)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = (data) => {
    if (selectedKPI) {
      // Update KPI
      setKpis(kpis.map(kpi => 
        kpi.id === selectedKPI.id ? { ...kpi, ...data } : kpi
      ))
      toast.success("Cập nhật KPI thành công")
    } else {
      // Create new KPI
      const newKPI = {
        id: kpis.length + 1,
        ...data
      }
      setKpis([...kpis, newKPI])
      toast.success("Thêm KPI mới thành công")
    }
    setIsFormOpen(false)
  }

  const confirmDelete = () => {
    setKpis(kpis.filter(kpi => kpi.id !== kpiToDelete.id))
    setIsDeleteDialogOpen(false)
    toast.success("Xóa KPI thành công")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý KPI</h2>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất làm việc của nhân viên
          </p>
        </div>
        <Button onClick={handleCreateKPI}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm KPI mới
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Mục tiêu</TableHead>
              <TableHead>Đã đạt được</TableHead>
              <TableHead>Hoàn thành</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kpis.map((kpi) => (
              <TableRow key={kpi.id}>
                <TableCell>{kpi.staffName}</TableCell>
                <TableCell>{kpi.target.toLocaleString()}đ</TableCell>
                <TableCell>{kpi.achieved.toLocaleString()}đ</TableCell>
                <TableCell>{kpi.completion}%</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(kpi.status)}`}>
                    {getStatusText(kpi.status)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditKPI(kpi)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteKPI(kpi)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <KPIForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedKPI}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa KPI này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
