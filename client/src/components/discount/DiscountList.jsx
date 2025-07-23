import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DiscountList({ list, handleCopy }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {list.map((discount) => (
        <div
          key={discount._id}
          className="rounded-2xl border-l-4 border-l-green-500 bg-white shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col gap-3 relative"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-extrabold text-green-700 tracking-wider select-all">
              {discount.code || 'MÃ'}
            </span>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-green-100 hover:text-green-700 transition"
              onClick={() => handleCopy(discount.code)}
            >
              Sao chép mã
            </Badge>
          </div>
          <div className="text-gray-600 text-sm mb-2 italic min-h-[32px]">{discount.description}</div>
          <div className="flex flex-wrap gap-2 text-sm mb-2">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
              {discount.discountType === 'percentage'
                ? `${discount.discountValue}%`
                : `${discount.discountValue?.toLocaleString('vi-VN')}₫`}
            </span>
            {discount.minOrderValue && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Đơn tối thiểu: {discount.minOrderValue?.toLocaleString('vi-VN')}₫
              </span>
            )}
            {discount.maxDiscount && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                Giảm tối đa: {discount.maxDiscount?.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
              HSD: {discount.endDate ? new Date(discount.endDate).toLocaleDateString('vi-VN') : 'Không xác định'}
            </span>
          </div>
        </div>
      ))}
      {list.length === 0 && (
        <div className="col-span-2 text-center text-muted-foreground py-8">Không có mã giảm giá nào</div>
      )}
    </div>
  );
} 