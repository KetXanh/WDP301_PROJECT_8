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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const assignmentSchema = z.object({
  selectedStaff: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một nhân viên"),
  notes: z.string().optional(),
})

export function TaskAssignmentForm({ open, onOpenChange, onSubmit, task, saleStaff }) {
  const form = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      selectedStaff: [],
      notes: "",
    },
  })

  useEffect(() => {
    if (task) {
      form.reset({
        selectedStaff: task.assignedTo || [],
        notes: task.notes || "",
      })
    } else {
      form.reset({
        selectedStaff: [],
        notes: "",
      })
    }
  }, [task, form])

  const handleSubmit = (data) => {
    onSubmit({
      selectedStaff: data.selectedStaff,
      notes: data.notes,
    })
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Giao công việc</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="selectedStaff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn nhân viên</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValue = field.value || []
                      if (!currentValue.includes(value)) {
                        field.onChange([...currentValue, value])
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân viên" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {saleStaff.map((staff) => (
                        <SelectItem key={staff._id} value={staff._id}>
                          {staff.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Array.isArray(field.value) ? field.value : []).map((staffId) => {
                      const staff = saleStaff.find(s => s._id === staffId);
                      return (
                        <span
                          key={staffId}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1"
                        >
                          {staff ? staff.username : staffId}
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange(field.value.filter((s) => s !== staffId))
                            }}
                            className="hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Thêm ghi chú cho công việc"
                      {...field}
                    />
                  </FormControl>
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
                Giao việc
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 