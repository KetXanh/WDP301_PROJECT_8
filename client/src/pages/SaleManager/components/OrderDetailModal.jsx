import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OrderDetailModal({ open, onClose, order }) {
  if (!order) return null;
  const o = order.orderId || {};
  const shipping = o.shippingAddress || {};
  const items = o.items || [];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div><b>Mã đơn:</b> {o._id}</div>
          <div><b>Khách hàng:</b> {o.user?.username || o.user || "-"}</div>
          <div><b>Tổng tiền:</b> {o.totalAmount?.toLocaleString('vi-VN')}₫</div>
          <div><b>Trạng thái:</b> <Badge>{o.status}</Badge></div>
          <div><b>Ngày tạo:</b> {o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : "-"}</div>
          <div><b>Ngày giao:</b> {o.deliveredAt ? new Date(o.deliveredAt).toLocaleString('vi-VN') : "-"}</div>
          <div><b>Địa chỉ giao hàng:</b> {shipping.fullName}, {shipping.street}, {shipping.ward}, {shipping.district}, {shipping.province}, {shipping.phone}</div>
          <div><b>Danh sách sản phẩm:</b>
            <ul className="list-disc ml-6">
              {items.map((item, idx) => (
                <li key={idx}>
                  Sản phẩm: {item.product} | SL: {item.quantity} | Giá: {item.price?.toLocaleString('vi-VN')}₫
                </li>
              ))}
            </ul>
          </div>
          <div><b>Trạng thái phân công:</b> {order.status}</div>
          <div><b>Ưu tiên:</b> {order.priority || "-"}</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 