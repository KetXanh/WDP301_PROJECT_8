import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { productStatistics } from "@/services/SaleManager/ApiSaleManager";

export default function ProductStatistics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productStatistics();
      // Gộp productBase và productVariants thành 1 bảng duy nhất
      const baseList = res.data.data.productBase || [];
      const variantList = res.data.data.products || [];
      // Map variant với base
      const merged = variantList.map(variant => {
        const base = baseList.find(b => b._id === variant.baseProduct?._id);
        return {
          id: variant._id,
          name: base?.name || "Không rõ",
          description: base?.description || "",
          image: base?.image?.url,
          price: variant.price,
          stock: variant.stock,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
          rating: variant.rating,
          ratingCount: variant.ratingCount,
          baseId: base?._id,
        };
      });
      setProducts(merged);
    } catch {
      toast.error("Không thể tải danh sách sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white rounded-2xl mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Danh sách sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-10 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                  <th className="px-4 py-2">Ảnh</th>
                  <th className="px-4 py-2">Tên sản phẩm</th>
                  <th className="px-4 py-2">Mô tả</th>
                  <th className="px-4 py-2">Giá</th>
                  <th className="px-4 py-2">Tồn kho</th>
                  <th className="px-4 py-2">Ngày tạo</th>
                  <th className="px-4 py-2">Ngày cập nhật</th>
                  <th className="px-4 py-2">Đánh giá</th>
                  <th className="px-4 py-2">ID</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr
                    key={product.id}
                    className="bg-white hover:bg-blue-50 transition rounded-xl shadow border border-gray-100"
                  >
                    <td className="px-4 py-2">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded border" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium">{product.name}</td>
                    <td className="px-4 py-2 text-gray-500 max-w-xs truncate">{product.description}</td>
                    <td className="px-4 py-2 text-right">{product.price?.toLocaleString('vi-VN')}₫</td>
                    <td className="px-4 py-2 text-center">{product.stock}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(product.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(product.updatedAt).toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-2 text-center">
                      {product.rating !== undefined ? (
                        <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
                          {product.rating} <span className="text-gray-400">({product.ratingCount || 0})</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-400 font-mono">{product.id}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-400">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
