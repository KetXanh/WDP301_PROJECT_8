import { Eye, Trash2, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fakeCategories = [
      {
        id: "CAT001",
        name: "Điện thoại",
        description: "Các sản phẩm điện thoại thông minh",
        createdAt: "2024-04-20",
      },
      {
        id: "CAT002",
        name: "Laptop",
        description: "Máy tính xách tay các loại",
        createdAt: "2024-05-01",
      },
    ];
    setCategories(fakeCategories);
  }, []);

  return (
    <div className="p-6 space-y-6 mt-10">
      {/* Header: Title + Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Search categories..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Categories Table */}
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
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cat.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cat.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cat.createdAt}</td>
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
            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Không có danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
