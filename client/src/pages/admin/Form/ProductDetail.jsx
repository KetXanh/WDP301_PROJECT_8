// src/components/Product/ProductDetailDialog.jsx
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function ProductDetail({ open, onOpenChange, product }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-50 w-[90vw] max-w-xl min-h-[50vh] max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold">
            Chi tiết sản phẩm
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Thông tin đầy đủ của sản phẩm.
          </Dialog.Description>

          {product && (
            <div className="space-y-2">
              <img
                src={product.baseProduct.image?.url}
                alt={product.baseProduct.name}
                className="w-32 h-32 object-cover rounded"
              />
              <p>
                <strong>Tên:</strong> {product.baseProduct.name}
              </p>
              <p>
                <strong>Mô tả:</strong> {product.baseProduct.description}
              </p>
              <p>
                <strong>Xuất xứ:</strong> {product.baseProduct.origin}
              </p>
              <p>
                <strong>Giá:</strong> {product.price?.toLocaleString()}đ
              </p>
              <p>
                <strong>Tồn kho:</strong> {product.stock}
              </p>
              <p>
                <strong>Trọng lượng:</strong> {product.productVariant?.weight}g
              </p>
              <p>
                <strong>Hạn sử dụng:</strong>{" "}
                {product.productVariant?.expiryDate
                  ? new Date(
                      product.productVariant.expiryDate
                    ).toLocaleDateString("vi-VN")
                  : "—"}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(product.baseProduct.createdAt).toLocaleDateString(
                  "vi-VN"
                )}
              </p>
            </div>
          )}

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
