import { Eye, Trash2, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllSubCategories } from "../../services/Admin/AdminAPI";

export default function SubCategory() {
  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAllSubCategories();
        if (Array.isArray(res.data.subCategories)) {
          setSubCategories(res.data.subCategories);
        } else {
          setSubCategories([]);
          setError("Dữ liệu danh mục con không hợp lệ");
        }
      } catch (error) {
        setError(
          "Không thể tải danh sách danh mục con. Vui lòng kiểm tra lại server."
        );
        setSubCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  const filteredSubCategories = subCategories.filter((subCategory) =>
    subCategory.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 mt-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh mục con</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={18} />
          Thêm danh mục con
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm danh mục con..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          <Filter size={18} />
          Lọc
        </button>
      </div>

      {/* Table */}
      {isLoading && <div className="text-center py-6">Đang tải...</div>}
      {error && <div className="text-center py-6 text-red-500">{error}</div>}

      {!isLoading && !error && (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 w-[140px]">
                  Mã
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 w-[120px]">
                  Tên
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[200px]">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 w-[160px]">
                  Danh mục cha
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 w-[100px]">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 w-[120px]">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 w-[100px]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredSubCategories.map((subCategory) => (
                <tr key={subCategory._id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {subCategory._id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {subCategory.name || "N/A"}
                  </td>
                  <td
                    className="px-4 py-4 whitespace-normal break-words max-w-[200px]"
                    title={subCategory.description}
                  >
                    {subCategory.description || "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {subCategory.category?.name ||
                      subCategory.category ||
                      "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {subCategory.status ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {subCategory.createdAt
                      ? new Date(subCategory.createdAt).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubCategories.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Không có danh mục con nào.
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
