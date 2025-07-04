import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"; 
import {
  getAllCategories,
  deleteCategory,
} from "../../services/Admin/AdminAPI";
import AddCategory from "./Form/AddCategory";
import UpdateCategory from "./Form/UpdateCategory";
import { Trash2, Filter, Plus, Edit, X } from "lucide-react";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllCategories();
      if (Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      } else {
        setError("Dữ liệu danh mục không hợp lệ");
        setCategories([]);
      }
    } catch (error) {
      setError("Không thể tải danh sách danh mục.");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá danh mục này không?"))
      return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Xoá danh mục thất bại.");
    }
  };

  const handleEditClick = (category) => {
    setEditCategory(category);
    setOpenEdit(true);
  };

  const filteredCategories = categories.filter(
    (category) =>
      (category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false) &&
      (statusFilter === ""
        ? true
        : category.status === (statusFilter === "true"))
  );

  return (
    <div className="p-6 space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh mục</h1>

        <Dialog.Root open={openAdd} onOpenChange={setOpenAdd}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {openAdd ? <X size={18} /> : <Plus size={18} />}
              {openAdd ? "Đóng form" : "Thêm danh mục"}
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
              bg-white p-6 rounded-xl shadow-2xl z-50 w-[90vw] max-w-md"
            >
              <Dialog.Title className="text-xl font-bold">
                Thêm danh mục
              </Dialog.Title>
              <AddCategory
                onSuccess={() => {
                  fetchCategories();
                  setOpenAdd(false);
                }}
              />
              <Dialog.Close asChild>
                <button className="absolute top-4 right-4 text-gray-500 hover:text-black">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm danh mục..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
              <Filter size={18} />
              Lọc
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white p-4 rounded shadow w-64 space-y-4 z-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Tất cả</option>
                <option value="true">Kích hoạt</option>
                <option value="false">Chưa kích hoạt</option>
              </select>
            </div>
           
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      {isLoading && <div className="text-center py-6">Đang tải...</div>}
      {error && <div className="text-center py-6 text-red-500">{error}</div>}

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
                  <td className="px-6 py-4">{category._id}</td>
                  <td className="px-6 py-4">{category.name || "N/A"}</td>
                  <td className="px-6 py-4">{category.description || "N/A"}</td>
                  <td className="px-4 py-4 text-center">
                    {category.status ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-4">
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(category)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(category._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Không tìm thấy danh mục nào. 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog.Root open={openEdit} onOpenChange={setOpenEdit}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
            bg-white p-6 rounded-xl shadow-2xl z-50 w-[90vw] max-w-md"
          >
            <Dialog.Title className="text-xl font-bold">
              Cập nhật danh mục
            </Dialog.Title>
            {editCategory && (
              <UpdateCategory
                category={editCategory}
                onSuccess={() => {
                  fetchCategories();
                  setOpenEdit(false);
                }}
              />
            )}
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-gray-500 hover:text-black">
                <X size={20} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
