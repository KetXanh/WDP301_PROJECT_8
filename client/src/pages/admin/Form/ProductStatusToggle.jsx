// components/Product/ProductStatusToggle.jsx
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { activeProduct } from "../../../services/Admin/AdminAPI";

export default function ProductStatusToggle({ product, onStatusChange }) {
  const handleToggleStatus = async () => {
    const productId = product.baseProduct._id;
    const currentStock = product.stock;
    const newStatus = currentStock < 0 ? "active" : "inactive";

    try {
      await activeProduct(productId, newStatus);
      toast.success(
        newStatus === "active"
          ? "Đã mở bán sản phẩm!"
          : "Đã ngừng kinh doanh sản phẩm!"
      );
      if (onStatusChange) onStatusChange(); 
    } catch (err) {
      console.error("Lỗi khi chuyển trạng thái:", err);
      toast.error("Không thể cập nhật trạng thái sản phẩm!");
    }
  };

  const isInactive = product.stock < 0;

  return (
    <button
      onClick={handleToggleStatus}
      className={`flex items-center gap-1 px-2 py-1 rounded ${
        isInactive
          ? "text-yellow-600 hover:text-green-800"
          : "text-green-600 hover:text-yellow-800"
      }`}
      title={isInactive ? "Mở bán lại" : "Ngừng kinh doanh"}
    >
      {isInactive ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}
