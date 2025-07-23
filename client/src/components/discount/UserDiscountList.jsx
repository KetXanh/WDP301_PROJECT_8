import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 4;

export default function UserDiscountList({ userDiscounts, handleCopy }) {
  const allUserDiscounts = userDiscounts.flatMap(userDiscount =>
    (userDiscount.discounts || []).map(d => ({
      ...d.discount,
      quantity_available: d.quantity_available,
      expired_at: d.expired_at,
      status: d.status,
    }))
  );
  const [page, setPage] = useState(1);
  const total = allUserDiscounts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pagedDiscounts = allUserDiscounts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-base text-gray-700">Tổng số mã giảm giá: <span className="text-blue-600">{total}</span></span>
        {totalPages > 1 && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-4 justify-start">
        {pagedDiscounts.map((discount) => (
          <div
            key={discount._id}
            className="w-full sm:w-[48%] md:w-[31%] lg:w-[23%] rounded-2xl border-l-4 border-l-blue-500 bg-white shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col gap-2 relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl font-extrabold text-blue-700 tracking-wider select-all">
                {discount.code || 'MÃ'}
              </span>
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition"
                onClick={() => handleCopy(discount.code)}
              >
                Sao chép mã
              </Badge>
            </div>
            <div className="text-gray-600 text-xs mb-1 italic min-h-[24px]">{discount.description}</div>
            <div className="flex flex-wrap gap-1 text-xs mb-1">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                {discount.discountType === 'percentage'
                  ? `${discount.discountValue}%`
                  : `${discount.discountValue?.toLocaleString('vi-VN')}₫`}
              </span>
              {discount.minOrderValue && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Đơn tối thiểu: {discount.minOrderValue?.toLocaleString('vi-VN')}₫
                </span>
              )}
              {discount.maxDiscount && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                  Giảm tối đa: {discount.maxDiscount?.toLocaleString('vi-VN')}₫
                </span>
              )}
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                HSD: {discount.expired_at ? new Date(discount.expired_at).toLocaleDateString('vi-VN') : 'Không xác định'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 text-xs mt-auto">
              <Badge variant={discount.status === 'active' ? 'success' : 'destructive'} className="px-2">
                {discount.status === 'active' ? 'Còn hiệu lực' : 'Hết hạn'}
              </Badge>
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                Số lượng còn: {discount.quantity_available}
              </span>
            </div>
          </div>
        ))}
        {pagedDiscounts.length === 0 && (
          <div className="text-center text-muted-foreground py-8 w-full">Bạn chưa có mã giảm giá nào</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
} 