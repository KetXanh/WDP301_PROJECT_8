import { useEffect, useState } from "react";
import { getAllDiscounts, getUserDiscounts } from "@/services/Customer/ApiDiscount";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    fetchDiscounts();
    fetchUserDiscounts();
  }, []);

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
      // Không báo lỗi nếu user chưa đăng nhập
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Đã sao chép mã giảm giá!");
  };

  const renderDiscountList = (list) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {list.map((discount) => (
        <div key={discount._id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-primary">{discount.code || 'MÃ'}</span>
            <Button size="sm" variant="outline" onClick={() => handleCopy(discount.code)}>
              Sao chép mã
            </Button>
          </div>
          <div className="text-gray-700">{discount.description}</div>
          <div className="flex flex-wrap gap-2 text-sm mt-2">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Mã giảm giá</h2>
      <div className="flex gap-2 mb-6">
        <Button variant={tab === "all" ? "default" : "outline"} onClick={() => setTab("all")}>Tất cả mã giảm giá</Button>
        <Button variant={tab === "user" ? "default" : "outline"} onClick={() => setTab("user")}>Mã giảm giá của bạn</Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : tab === "all" ? (
        renderDiscountList(discounts)
      ) : (
        renderDiscountList(userDiscounts)
      )}
    </div>
  );
}
