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
import { getAllDiscounts, createDiscount, updateDiscount, deleteDiscount } from "@/services/SaleManager/ApiSaleManager"

export default function ManagerDiscount() {
  const [discounts, setDiscounts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [discountToDelete, setDiscountToDelete] = useState(null)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      const res = await getAllDiscounts()
      setDiscounts(res.data.discounts || [])
    } catch (error) {
      toast.error("Không thể tải danh sách giảm giá")
    }
  }

  const handleAddNew = () => {
    setSelectedDiscount(null)
    setShowForm(true)
  }

  const handleEdit = (discount) => {
    setSelectedDiscount(discount)
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
    } catch (error) {
      toast.error("Không thể xóa chương trình giảm giá")
    }
    setShowDeleteDialog(false)
    setDiscountToDelete(null)
  }

  const handleFormSubmit = async (data) => {
    try {
      if (selectedDiscount) {
        await updateDiscount(selectedDiscount._id, data)
        toast.success("Cập nhật chương trình giảm giá thành công")
      } else {
        await createDiscount(data)
        toast.success("Thêm chương trình giảm giá thành công")
      }
      fetchDiscounts()
    } catch (error) {
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableRow key={discount.id}>
                <TableCell>{discount.name}</TableCell>
                <TableCell>{discount.type === 'percentage' ? 'Phần trăm' : 'Số tiền cố định'}</TableCell>
                <TableCell>
                  {discount.type === 'percentage' ? `${discount.value}%` : `${discount.value.toLocaleString()}đ`}
                </TableCell>
                <TableCell>{new Date(discount.startDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{new Date(discount.endDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    discount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {discount.status === 'active' ? 'Đang áp dụng' : 'Đã kết thúc'}
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