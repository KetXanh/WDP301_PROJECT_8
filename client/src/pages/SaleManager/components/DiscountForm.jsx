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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const discountSchema = z.object({
  name: z.string().min(1, "Tên chương trình không được để trống"),
  type: z.enum(["percentage", "fixed"], {
    required_error: "Vui lòng chọn loại giảm giá",
  }),
  value: z.string().min(1, "Giá trị giảm không được để trống")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Giá trị giảm phải là số dương"
    }),
  maxDiscount: z.string().min(1, "Giảm tối đa không được để trống")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Giảm tối đa phải là số dương"
    }),
  description: z.string().optional(),
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
  endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
  status: z.enum(["active", "inactive"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
}).refine((data) => {
  if (data.type === "percentage") {
    return Number(data.value) <= 100
  }
  return true
}, {
  message: "Giá trị giảm theo phần trăm không được vượt quá 100%",
  path: ["value"],
}).refine((data) => {
  return new Date(data.startDate) <= new Date(data.endDate)
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["endDate"],
})

export function DiscountForm({ open, onOpenChange, onSubmit, initialData }) {
  const form = useForm({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: "",
      type: "percentage",
      value: "",
      maxDiscount: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        value: initialData.value.toString(),
        maxDiscount: initialData.maxDiscount.toString(),
      })
    } else {
      form.reset({
        name: "",
        type: "percentage",
        value: "",
        maxDiscount: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "active",
      })
    }
  }, [initialData, form])

  const handleSubmit = (data) => {
    onSubmit({
      ...data,
      value: Number(data.value),
      maxDiscount: Number(data.maxDiscount),
    })
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Cập nhật chương trình giảm giá" : "Thêm chương trình giảm giá mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chương trình</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên chương trình giảm giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại giảm giá</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại giảm giá" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed">Số tiền cố định</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị giảm</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập giá trị giảm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giảm tối đa (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số tiền giảm tối đa"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết chương trình giảm giá"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                      <SelectItem value="active">Đang áp dụng</SelectItem>
                      <SelectItem value="inactive">Đã kết thúc</SelectItem>
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