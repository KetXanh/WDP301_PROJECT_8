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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const assignmentSchema = z.object({
  assignedTo: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một nhân viên"),
  notes: z.string().optional(),
})

export function TaskAssignmentForm({ open, onOpenChange, onSubmit, task, saleStaff }) {
  const form = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      assignedTo: [],
      notes: "",
    },
  })

  useEffect(() => {
    if (task) {
      // Nếu task đã có assignments, lấy danh sách user IDs
      const currentAssignments = task.assignments || [];
      const currentUserIds = currentAssignments.map(assignment => 
        typeof assignment.assignedTo === 'object' ? assignment.assignedTo._id : assignment.assignedTo
      );
      
      form.reset({
        assignedTo: currentUserIds,
        notes: task.notes || "",
      })
    } else {
      form.reset({
        assignedTo: [],
        notes: "",
      })
    }
  }, [task, form])

  const handleSubmit = (data) => {
    onSubmit({
      assignedTo: data.assignedTo,
      notes: data.notes,
    })
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Giao công việc</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assignedTo"
              render={() => (
                <FormItem>
                  <FormLabel>Chọn nhân viên</FormLabel>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {saleStaff.map((staff) => (
                      <FormField
                        key={staff._id}
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={staff._id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(staff._id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, staff._id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== staff._id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {staff.username} ({staff.email})
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
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