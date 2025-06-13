import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const kpiSchema = z.object({
  staffName: z.string().min(1, "Vui lòng chọn nhân viên"),
  target: z.string().min(1, "Mục tiêu không được để trống")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Mục tiêu phải là số dương"
    }),
  achieved: z.string().min(1, "Số tiền đã đạt được không được để trống")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Số tiền đã đạt được phải là số không âm"
    }),
  status: z.enum(["not-started", "in-progress", "completed"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
})

export function KPIForm({ open, onOpenChange, onSubmit, initialData }) {
  const form = useForm({
    resolver: zodResolver(kpiSchema),
    defaultValues: {
      staffName: "",
      target: "",
      achieved: "",
      status: "not-started",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        target: initialData.target.toString(),
        achieved: initialData.achieved.toString(),
      })
    } else {
      form.reset({
        staffName: "",
        target: "",
        achieved: "",
        status: "not-started",
      })
    }
  }, [initialData, form])

  const handleSubmit = (data) => {
    onSubmit({
      ...data,
      target: Number(data.target),
      achieved: Number(data.achieved),
      completion: Math.round((Number(data.achieved) / Number(data.target)) * 100),
    })
    form.reset()
  }

  // Mock data - sẽ thay thế bằng data thật từ API
  const employees = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê Văn C" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Cập nhật KPI" : "Thêm KPI mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="staffName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhân viên</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân viên" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.name}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mục tiêu (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập mục tiêu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="achieved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đã đạt được (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số tiền đã đạt được"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
                      <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {initialData ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 