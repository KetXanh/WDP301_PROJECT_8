import { Eye, Trash2, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../services/Admin/AdminAPI"; 

export default function Product() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data.products); // Đảm bảo BE trả về { products: [...] }
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Cập nhật lại danh sách
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Tên
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Giá
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">
                  <img
                    src={product.image?.url}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  {product.price.toLocaleString()} đ
                </td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
