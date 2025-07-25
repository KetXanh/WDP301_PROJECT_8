import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 4;

export default function UserDiscountList({ userDiscounts }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const cardClass = "w-full rounded-3xl border-2 border-transparent bg-gradient-to-br from-blue-50 via-white to-green-50 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 p-4 flex flex-col gap-2 relative group mb-2";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-base text-gray-700">{t('userDiscountList.total')}: <span className="text-blue-600">{total}</span></span>
        {totalPages > 1 && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
          />
        )}
      </div>
      <div className="flex flex-col gap-6 justify-start">
        {pagedDiscounts.map((discount) => (
          <div
            key={discount._id}
            className={cardClass}
            style={{ borderImage: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%) 1' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-2 text-xl font-extrabold text-blue-700 tracking-wider select-all">
                <FaTag className="text-blue-400" />
                {discount.code || t('discountList.code')}
              </span>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1 rounded-lg shadow"
                onClick={() => navigate('/cart')}
              >
                {t('userDiscountList.useNow')}
              </Button>
            </div>
            <div className="text-gray-600 text-xs mb-1 italic min-h-[24px] font-medium">{discount.description}</div>
            <div className="flex flex-wrap gap-1 text-xs mb-1">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                {discount.discountType === 'percentage'
                  ? `${discount.discountValue}%`
                  : `${discount.discountValue?.toLocaleString('vi-VN')}₫`}
              </span>
              {discount.minOrderValue && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  {t('discountList.minOrder')}: {discount.minOrderValue?.toLocaleString('vi-VN')}₫
                </span>
              )}
              {discount.maxDiscount && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-semibold">
                  {t('discountList.maxDiscount')}: {discount.maxDiscount?.toLocaleString('vi-VN')}₫
                </span>
              )}
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">
                {t('discountList.expiry')}: {discount.expired_at ? new Date(discount.expired_at).toLocaleDateString('vi-VN') : t('discountList.noExpiry')}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 text-xs mt-auto">
              <Badge variant={discount.status === 'active' ? 'success' : 'destructive'} className="px-2">
                {discount.status === 'active' ? t('userDiscountList.active') : t('userDiscountList.expired')}
              </Badge>
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">
                {t('userDiscountList.remaining')}: {discount.quantity_available}
              </span>
            </div>
          </div>
        ))}
        {pagedDiscounts.length === 0 && (
          <div className="text-center text-muted-foreground py-12 w-full text-lg font-semibold flex flex-col items-center gap-2">
            <FaTag className="text-4xl text-blue-300 mb-2" />
            {t('userDiscountList.noDiscount')}
          </div>
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