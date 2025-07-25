import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { assignOrder } from "@/services/SaleManager/ApiSaleManager";

const formSchema = z.object({
  selectedStaff: z.string().min(1, "Vui lòng chọn nhân viên"),
});

export default function OrderAssignmentForm({ open, onOpenChange, order, staffList, onAssign }) {
  const [loading, setLoading] = useState(false);
  const [staffOrderCounts, setStaffOrderCounts] = useState({});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedStaff: "",
    },
  });

  // Fetch current order counts for each staff
  useEffect(() => {
    const fetchStaffOrderCounts = async () => {
      try {
        // TODO: Replace with actual API call
        const mockCounts = (Array.isArray(staffList) ? staffList : []).reduce((acc, staff) => ({
          ...acc,
          [staff._id]: Math.floor(Math.random() * 5) // Mock data for testing
        }), {});
        setStaffOrderCounts(mockCounts);
      } catch (error) {
        console.error("Error fetching staff order counts:", error);
        toast.error("Không thể tải số lượng order của nhân viên");
      }
    };

    if (open) {
      fetchStaffOrderCounts();
    }
  }, [open, staffList]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (!data.selectedStaff) {
        toast.error("Vui lòng chọn nhân viên");
        return;
      }
      // Gọi API gán order
      await assignOrder(order._id, data.selectedStaff);
      toast.success("Giao order thành công");
      onAssign();
      onOpenChange(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Không thể giao order");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Giao Order</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="selectedStaff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn nhân viên</FormLabel>
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
                      {(Array.isArray(staffList) ? staffList : []).map((staff) => (
                        <SelectItem key={staff._id} value={staff._id}>
                          {staff.username} (Số order hiện tại: {staffOrderCounts[staff._id] || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Giao order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 