import { useEffect, useState } from "react";
import { getAllDiscounts } from "@/services/Customer/ApiDiscount";
import { getUserDiscounts, assignDiscountToUser } from "@/services/Customer/ApiUserDiscount";
import { toast } from "sonner";
import LuckyWheel from "@/components/discount/LuckyWheel";
import DiscountList from "@/components/discount/DiscountList";
import UserDiscountList from "@/components/discount/UserDiscountList";

function getActiveDiscounts(discounts) {
  return discounts.filter(d => d.active !== false && (!d.endDate || new Date(d.endDate) > new Date()));
}

function getReceivableQuantity(userDiscounts) {
  if (!userDiscounts || userDiscounts.length === 0) return 0;
  return userDiscounts[0].receivable_quantity || 0;
}

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receivable, setReceivable] = useState(0);

  useEffect(() => {
    fetchDiscounts();
    fetchUserDiscounts();
  }, []);

  useEffect(() => {
    setReceivable(getReceivableQuantity(userDiscounts));
  }, [userDiscounts]);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await getAllDiscounts();
      setDiscounts(res.data?.data || []);
    } catch {
      toast.error("Không thể tải mã giảm giá");
    }
    setLoading(false);
  };

  const fetchUserDiscounts = async () => {
    try {
      const res = await getUserDiscounts();
      setUserDiscounts(res.data?.data || []);
    } catch {
      toast.error("Không thể tải mã giảm giá của bạn");
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Đã sao chép mã giảm giá!");
  };

  // Xử lý khi quay vòng quay may mắn
  const handleSpin = async (item) => {
    if (item.type === 'discount') {
      // Gán discount cho user (nếu cần)
      try {
        await assignDiscountToUser(item.discount._id);
        toast.success(`Chúc mừng! Bạn đã nhận được mã giảm giá: ${item.discount.code}`);
        fetchUserDiscounts();
      } catch {
        toast.error('Có lỗi khi nhận mã giảm giá, vui lòng thử lại!');
      }
    } else {
      toast.info('Chúc bạn may mắn lần sau!');
    }
    setReceivable(r => Math.max(0, r - 1));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Vòng quay may mắn - Mã giảm giá</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Bên trái: LuckyWheel + DiscountList */}
        <div className="flex-1 min-w-0">
          <LuckyWheel
            discounts={getActiveDiscounts(discounts)}
            receivableQuantity={receivable}
            onSpin={handleSpin}
            result={null}
          />
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DiscountList list={getActiveDiscounts(discounts)} handleCopy={handleCopy} />
          )}
        </div>
        {/* Bên phải: UserDiscountList */}
        <div className="w-full md:w-[380px] lg:w-[420px] xl:w-[480px]">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Mã giảm giá của bạn</h3>
            <UserDiscountList userDiscounts={userDiscounts} handleCopy={handleCopy} />
          </div>
        </div>
      </div>
    </div>
  );
}
