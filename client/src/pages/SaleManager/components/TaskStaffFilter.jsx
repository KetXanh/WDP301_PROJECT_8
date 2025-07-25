import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function TaskStaffFilter({ saleStaff, selectedStaffId, onChange }) {
  return (
    <Select value={selectedStaffId} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Lọc theo nhân viên" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả nhân viên</SelectItem>
        {saleStaff.map(staff => (
          <SelectItem key={staff._id} value={staff._id}>
            {staff.username} ({staff.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 