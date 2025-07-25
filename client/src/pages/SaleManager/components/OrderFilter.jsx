import { Badge } from "@/components/ui/badge";
import { Filter, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả", color: "bg-gray-500", icon: null },
  { value: "pending", label: "Chờ xử lý", color: "bg-yellow-500", icon: null },
  { value: "assigned", label: "Đã giao", color: "bg-blue-500", icon: null },
  { value: "completed", label: "Hoàn thành", color: "bg-green-500", icon: null },
];

export function OrderFilter({ currentFilter, onFilterChange }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Lọc theo trạng thái</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status.value}
            onClick={() => onFilterChange(status.value)}
            className={cn(
              "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              "hover:bg-muted/50",
              currentFilter === status.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <span className={cn(
              "w-2 h-2 rounded-full",
              status.color
            )} />
            {status.label}
            {currentFilter === status.value && (
              <Check className="h-4 w-4" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 