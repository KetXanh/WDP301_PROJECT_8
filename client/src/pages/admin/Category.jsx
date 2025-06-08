import { Eye, Trash2, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../services/Admin/AdminAPI";

export default function Category() {
  const [categories, setCategories] = useState([]); // Khởi tạo categories là mảng rỗng
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAllCategories();
        // Kiểm tra xem res.data.categories có phải là mảng không
        if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          console.error("Dữ liệu API không chứa mảng categories:", res.data);
          setCategories([]);
          setError("Dữ liệu danh mục không hợp lệ");
        }
      } catch (error) {
        setError(
          "Không thể tải danh sách danh mục. Vui lòng kiểm tra lại server."
        );
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Hàm lọc danh mục dựa trên searchTerm
  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 mt-10">
      {/* Header: Title + Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh mục</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm danh mục..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          <Filter size={18} />
          Lọc
        </button>
      </div>

      {/* Hiển thị lỗi hoặc loading */}
      {isLoading && <div className="text-center py-6">Đang tải...</div>}
      {error && <div className="text-center py-6 text-red-500">{error}</div>}

      {/* Categories Table */}
      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Mã danh mục
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Tên danh mục
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">
                  Trạng thái
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
              {filteredCategories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">{category.description || "N/A"}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {category.status ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Không có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
