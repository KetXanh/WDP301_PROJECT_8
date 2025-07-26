import { useState, useEffect } from "react"
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
import { DiscountForm } from "./components/DiscountForm"
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
import { getAllDiscounts, createDiscount, updateDiscount, deleteDiscount, getDiscountStats } from "@/services/SaleManager/ApiSaleManager"

export default function ManagerDiscount() {
  const [discounts, setDiscounts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [discountToDelete, setDiscountToDelete] = useState(null)
  const [stats, setStats] = useState({
    totalDiscounts: 0,
    activeDiscounts: 0,
    expiredDiscounts: 0,
    totalUsage: 0,
    totalDiscountValue: 0,
    typeStats: {},
    monthlyStats: [],
    topUsedDiscounts: []
  })

  useEffect(() => {
    fetchDiscounts()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await getDiscountStats()
      if (res.data?.data) {
        setStats(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchDiscounts = async () => {
    try {
      const res = await getAllDiscounts()
      // Chuẩn hóa dữ liệu trả về từ backend
      const discountsData = Array.isArray(res.data.data) ? res.data.data : []
      setDiscounts(discountsData)
    } catch {
      toast.error("Không thể tải danh sách giảm giá")
    }
  }

  const handleAddNew = () => {
    setSelectedDiscount(null)
    setShowForm(true)
  }

  const handleEdit = (discount) => {
    // Map lại dữ liệu cho DiscountForm
    setSelectedDiscount({
      ...discount,
      name: discount.description || "",
      type: discount.discountType,
      value: discount.discountValue,
      maxDiscount: discount.maxDiscount || 0,
      startDate: discount.startDate ? discount.startDate.slice(0, 10) : "",
      endDate: discount.endDate ? discount.endDate.slice(0, 10) : "",
      status: discount.active ? "active" : "inactive",
    })
    setShowForm(true)
  }

  const handleDelete = (discount) => {
    setDiscountToDelete(discount)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteDiscount(discountToDelete._id)
      toast.success("Xóa chương trình giảm giá thành công")
      fetchDiscounts()
      fetchStats() // Cập nhật thống kê sau khi xóa
    } catch {
      toast.error("Không thể xóa chương trình giảm giá")
    }
    setShowDeleteDialog(false)
    setDiscountToDelete(null)
  }

  const handleFormSubmit = async (data) => {
    // Map lại dữ liệu gửi lên backend
    const payload = {
      description: data.name,
      discountType: data.type,
      discountValue: Number(data.value),
      maxDiscount: Number(data.maxDiscount),
      startDate: data.startDate,
      endDate: data.endDate,
      active: data.status === "active",
    }
    try {
      if (selectedDiscount && selectedDiscount._id) {
        await updateDiscount(selectedDiscount._id, payload)
        toast.success("Cập nhật chương trình giảm giá thành công")
      } else {
        await createDiscount(payload)
        toast.success("Thêm chương trình giảm giá thành công")
      }
      fetchDiscounts()
      fetchStats() // Cập nhật thống kê sau khi thay đổi
    } catch {
      toast.error("Không thể lưu chương trình giảm giá")
    }
    setShowForm(false)
    setSelectedDiscount(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý giảm giá</h2>
          <p className="text-muted-foreground">
            Danh sách các chương trình giảm giá
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm mới
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng mã giảm giá</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDiscounts}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeDiscounts}</p>
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
              <p className="text-sm font-medium text-gray-600">Tổng lượt sử dụng</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalUsage}</p>
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
              <p className="text-sm font-medium text-gray-600">Tổng giá trị</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalDiscountValue?.toLocaleString()}đ</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê theo loại */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-3">Thống kê theo loại</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Phần trăm</span>
              <span className="font-medium">{stats.typeStats?.percentage?.count || 0} mã</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Số tiền cố định</span>
              <span className="font-medium">{stats.typeStats?.fixed?.count || 0} mã</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-3">Top mã được sử dụng</h3>
          <div className="space-y-2">
            {stats.topUsedDiscounts?.slice(0, 3).map((discount, index) => (
              <div key={discount._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{discount.code}</span>
                <span className="font-medium">{discount.usedCount} lượt</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã code</TableHead>
              <TableHead>Tên chương trình</TableHead>
              <TableHead>Loại giảm giá</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount._id}>
                <TableCell>{discount.code}</TableCell>
                <TableCell>{discount.description}</TableCell>
                <TableCell>{discount.discountType === 'percentage' ? 'Phần trăm' : 'Số tiền cố định'}</TableCell>
                <TableCell>
                  {discount.discountType === 'percentage' ? `${discount.discountValue}%` : `${discount.discountValue?.toLocaleString()}đ`}
                </TableCell>
                <TableCell>{discount.startDate ? new Date(discount.startDate).toLocaleDateString('vi-VN') : ''}</TableCell>
                <TableCell>{discount.endDate ? new Date(discount.endDate).toLocaleDateString('vi-VN') : ''}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    discount.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {discount.active ? 'Đang áp dụng' : 'Đã kết thúc'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(discount)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(discount)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DiscountForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
        initialData={selectedDiscount}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chương trình giảm giá này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}