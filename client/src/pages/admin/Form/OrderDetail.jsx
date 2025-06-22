import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { getOrderDetailByID } from "../../../services/Admin/AdminAPI";

export default function OrderDetail({ orderId, onClose }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      getOrderDetailByID(orderId)
        .then((res) => setOrder(res.data))
        .catch((err) => console.error("Lỗi khi lấy chi tiết:", err));
    }
  }, [orderId]);

  if (!order) return null;

  return (
    <Dialog open={!!orderId} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow w-[90%] max-w-2xl space-y-4 overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-xl font-bold">
            Chi tiết đơn hàng
          </Dialog.Title>

          <div className="space-y-1 text-sm">
            <p>
              <strong>Mã đơn:</strong> {order._id}
            </p>
            <p>
              <strong>Khách hàng:</strong> {order.user?.username || "Không rõ"}{" "}
              ({order.user?.email})
            </p>
            <p>
              <strong>SĐT:</strong> {order.user?.phone || "Không rõ"}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.status}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Địa chỉ:</strong>{" "}
              {[
                order.shippingAddress?.street,
                order.shippingAddress?.ward,
                order.shippingAddress?.district,
                order.shippingAddress?.province,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mt-4">Sản phẩm:</h4>
            <ul className="space-y-3 mt-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 border-b pb-2">
                  <img
                    src={item.product?.baseProduct?.image?.url}
                    alt={item.product?.baseProduct?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.product?.baseProduct?.name}
                    </p>
                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                    <p className="text-sm text-gray-500">
                      Giá đặt: {item.price?.toLocaleString()} đ
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-right font-semibold">
            Tổng cộng: {order.totalAmount?.toLocaleString()} đ
          </p>

          <div className="text-right">
            <button
              onClick={onClose}
              className="mt-4 bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
