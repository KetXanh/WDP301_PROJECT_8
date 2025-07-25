import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaTag, FaRegCopy } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function DiscountList({ list, handleCopy, compact }) {
  const { t } = useTranslation();
  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {list.map((discount) => (
          <div
            key={discount._id}
            className="rounded-xl border border-green-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 px-3 py-2 mb-1 w-full flex flex-col gap-1"
          >
            <span className="flex items-center gap-1 text-base font-bold text-green-700 select-all">
              <FaTag className="text-green-400 text-lg" />
              {discount.code || t('discountList.code')}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold w-fit">
                {discount.discountType === 'percentage'
                  ? `${discount.discountValue}%`
                  : `${discount.discountValue?.toLocaleString('vi-VN')}₫`}
              </span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold w-fit">
                {discount.endDate ? new Date(discount.endDate).toLocaleDateString('vi-VN') : t('discountList.noExpiry')}
              </span>
            </span>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center text-muted-foreground py-6 text-sm font-semibold flex flex-col items-center gap-1">
            <FaTag className="text-2xl text-blue-300 mb-1" />
            {t('discountList.noDiscount')}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {list.map((discount) => (
        <div
          key={discount._id}
          className="relative rounded-3xl border-2 border-transparent bg-gradient-to-br from-green-50 via-white to-blue-50 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 p-6 flex flex-col gap-4 group w-full mb-2"
          style={{ borderImage: 'linear-gradient(135deg, #34d399 0%, #60a5fa 100%) 1' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-2xl font-extrabold text-green-700 tracking-wider select-all">
              <FaTag className="text-green-400" />
              {discount.code || t('discountList.code')}
            </span>
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs cursor-pointer hover:bg-green-100 hover:text-green-700 transition px-2 py-1 border-green-300"
              onClick={() => handleCopy(discount.code)}
            >
              <FaRegCopy className="text-green-500" /> {t('discountList.copy')}
            </Badge>
          </div>
          <div className="text-gray-600 text-base mb-2 italic min-h-[32px] font-medium">{discount.description}</div>
          <div className="flex flex-wrap gap-2 text-sm mb-2">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold">
              {discount.discountType === 'percentage'
                ? `${discount.discountValue}%`
                : `${discount.discountValue?.toLocaleString('vi-VN')}₫`}
            </span>
            {discount.minOrderValue && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold">
                {t('discountList.minOrder')}: {discount.minOrderValue?.toLocaleString('vi-VN')}₫
              </span>
            )}
            {discount.maxDiscount && (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded font-semibold">
                {t('discountList.maxDiscount')}: {discount.maxDiscount?.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-semibold">
              {t('discountList.expiry')}: {discount.endDate ? new Date(discount.endDate).toLocaleDateString('vi-VN') : t('discountList.noExpiry')}
            </span>
          </div>
        </div>
      ))}
      {list.length === 0 && (
        <div className="text-center text-muted-foreground py-12 text-lg font-semibold flex flex-col items-center gap-2">
          <FaTag className="text-4xl text-blue-300 mb-2" />
          {t('discountList.noDiscount')}
        </div>
      )}
    </div>
  );
} 