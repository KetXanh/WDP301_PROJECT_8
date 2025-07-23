import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OrderDetailModal({ open, onClose, order }) {
  if (!order) return null;
  const o = order.orderId || order || {};
  const shipping = o.shippingAddress || {};
  const items = o.items || [];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Thông tin tổng quan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 border">
            <div>
              <div className="mb-1"><span className="font-semibold">Mã đơn:</span> <span className="font-mono">{o._id}</span></div>
              <div className="mb-1"><span className="font-semibold">Khách hàng:</span> {o.user?.username || o.user || "-"}</div>
              <div className="mb-1"><span className="font-semibold">Tổng tiền:</span> <span className="text-blue-700 font-bold">{o.totalAmount?.toLocaleString('vi-VN')}₫</span></div>
              <div className="mb-1"><span className="font-semibold">Trạng thái:</span> <Badge className="ml-1">{o.status}</Badge></div>
              <div className="mb-1"><span className="font-semibold">Ngày tạo:</span> {o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : "-"}</div>
              <div className="mb-1"><span className="font-semibold">Ngày giao:</span> {o.deliveredAt ? new Date(o.deliveredAt).toLocaleString('vi-VN') : "-"}</div>
            </div>
            <div>
              <div className="mb-1 font-semibold">Địa chỉ giao hàng:</div>
              <div className="text-sm text-gray-700">
                <div>Tên người nhận: {shipping.fullName}</div>
                <div>Địa chỉ: {shipping.street}, {shipping.ward},{shipping.district}, {shipping.province}</div>
                <div>Số điện thoại : {shipping.phone}</div>
              </div>
              <div className="mt-2"><span className="font-semibold">Trạng thái đơn hàng:</span> {order.status}</div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <div className="font-semibold mb-2">Danh sách sản phẩm:</div>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm">
                    <th className="p-2 border">Ảnh</th>
                    <th className="p-2 border">Tên sản phẩm</th>
                    <th className="p-2 border">Số lượng</th>
                    <th className="p-2 border">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="p-2 border">
                        {item.product?.baseProduct?.image?.url ? (
                          <img src={item.product.baseProduct.image.url} alt={item.product.baseProduct.name} className="w-12 h-12 object-cover rounded shadow" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">-</div>
                        )}
                      </td>
                      <td className="p-2 border font-medium text-left">
                        {item.product?.baseProduct?.name || item.product?.name || item.product?._id || item.product || "-"}
                      </td>
                      <td className="p-2 border">{item.quantity}</td>
                      <td className="p-2 border text-blue-700 font-semibold">{item.price?.toLocaleString('vi-VN')}₫</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-gray-400 py-4">Không có sản phẩm nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 