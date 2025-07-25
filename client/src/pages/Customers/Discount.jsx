import { useEffect, useState } from "react";
import { getAllDiscounts } from "@/services/Customer/ApiDiscount";
import { getUserDiscounts, assignDiscountToUser } from "@/services/Customer/ApiUserDiscount";
import { toast } from "sonner";
import LuckyWheel from "@/components/discount/LuckyWheel";
import DiscountList from "@/components/discount/DiscountList";
import UserDiscountList from "@/components/discount/UserDiscountList";
import { FaGift } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function getActiveDiscounts(discounts) {
  return discounts.filter(d => d.active !== false && (!d.endDate || new Date(d.endDate) > new Date()));
}

function getReceivableQuantity(userDiscounts) {
  if (!userDiscounts || userDiscounts.length === 0) return 0;
  return userDiscounts[0].receivable_quantity || 0;
}

export default function Discount() {
  const { t } = useTranslation();
  const [discounts, setDiscounts] = useState([]);
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [receivable, setReceivable] = useState(0);

  useEffect(() => {
    fetchDiscounts();
    fetchUserDiscounts();
  }, []);

  useEffect(() => {
    setReceivable(getReceivableQuantity(userDiscounts));
  }, [userDiscounts]);

  const fetchDiscounts = async () => {
    try {
      const res = await getAllDiscounts();
      setDiscounts(res.data?.data || []);
    } catch {
      toast.error(t('discountList.loadError'));
    }
  };

  const fetchUserDiscounts = async () => {
    try {
      const res = await getUserDiscounts();
      setUserDiscounts(res.data?.data || []);
    } catch {
      toast.error(t('userDiscountList.loadError'));
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(t('discountList.copied'));
  };

  // Xử lý khi quay vòng quay may mắn
  const handleSpin = async (item) => {
    console.log('LuckyWheel spin result:', item);
    if (item.type === 'discount') {
      try {
        const res = await assignDiscountToUser(item.discount._id);
        toast.success(t('luckyWheel.toastCongrats', { code: item.discount.code }));
        fetchUserDiscounts();
        console.log('API assignDiscountToUser response:', res);
      } catch (err) {
        toast.error(t('luckyWheel.toastError'));
        console.error('API assignDiscountToUser error:', err);
      }
    } else if (item.type === 'lose') {
      try {
        const { addReceivableDiscount } = await import('@/services/Customer/ApiUserDiscount');
        await addReceivableDiscount(-1);
        toast.info(t('luckyWheel.toastTryAgain'));
        fetchUserDiscounts();
      } catch {
        toast.error('Không thể trừ lượt quay!');
      }
    }
    setReceivable(r => Math.max(0, r - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-2">
      <div className="max-w-7xl mx-auto rounded-3xl shadow-2xl bg-white/90 p-8 md:p-12 border border-blue-100">
        <h2 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-extrabold mb-10 text-blue-700 drop-shadow-lg">
          <FaGift className="text-pink-500 text-4xl" />
          {t('discountPage.title')}
        </h2>
        <div className="flex flex-col md:flex-row md:flex-nowrap gap-6 md:gap-8">
          {/* Bên trái: DiscountList nhỏ gọn */}
          <div className="w-full md:basis-1/6 lg:basis-1/6 max-w-[220px] flex-shrink-0">
            <div className="rounded-2xl border border-green-200 bg-white/80 shadow-lg p-3 h-full flex flex-col">
              <h4 className="text-base font-bold text-green-700 mb-3 text-center">{t('discountPage.available')}</h4>
              <div className="flex-1 overflow-y-auto max-h-[420px] pr-1">
                <DiscountList list={getActiveDiscounts(discounts)} handleCopy={handleCopy} compact />
              </div>
            </div>
          </div>
          {/* Ở giữa: LuckyWheel chiếm 2/3 màn hình */}
          <div className="flex-1 md:basis-2/3 flex items-center justify-center min-w-0">
            <div className="rounded-2xl border border-blue-200 bg-white/80 shadow-lg p-10 w-full max-w-4xl flex items-center justify-center">
              <LuckyWheel
                discounts={getActiveDiscounts(discounts)}
                receivableQuantity={receivable}
                onSpin={handleSpin}
                result={null}
              />
            </div>
          </div>
          {/* Bên phải: UserDiscountList */}
          <div className="w-full md:basis-1/6 lg:basis-1/6 max-w-[420px]">
            <div className="bg-gradient-to-br from-blue-100 via-white to-green-100 rounded-3xl shadow-xl border-2 border-blue-200 p-6 mb-4">
              <h3 className="flex items-center justify-center gap-2 text-xl font-bold mb-6 text-blue-800">
                <FaGift className="text-pink-400 text-2xl" />
                {t('discountPage.yourDiscounts')}
              </h3>
              <UserDiscountList userDiscounts={userDiscounts} handleCopy={handleCopy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
