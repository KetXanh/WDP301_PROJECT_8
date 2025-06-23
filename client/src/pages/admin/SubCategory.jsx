import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  getAllSubCategories,
  deleteSubCategory,
  getAllCategories,
} from "../../services/Admin/AdminAPI";
import AddSubCategory from "./Form/AddSubCategory";
import UpdateSubCategory from "./Form/UpdateSubCategory";
import { Trash2, Filter, Plus, Edit, X } from "lucide-react";

export default function SubCategory() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editSubCategory, setEditSubCategory] = useState(null);

  const fetchSubCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllSubCategories();
      console.log("Dữ liệu subCategories:", res.data); 
      if (Array.isArray(res.data.subCategories)) {
        setSubCategories(res.data.subCategories);
      } else {
        setError("Dữ liệu danh mục con không hợp lệ");
        setSubCategories([]);
      }
    } catch (error) {
      setError("Không thể tải danh sách danh mục con.");
      setSubCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      if (Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      setError("Không thể tải danh sách danh mục cha.");
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục con này không?"))
      return;
    try {
      await deleteSubCategory(id);
      setSubCategories((prev) => prev.filter((sc) => sc._id !== id));
    } catch (err) {
      alert("Xóa danh mục con thất bại.");
    }
  };

  const handleEditClick = (subCategory) => {
    setEditSubCategory(subCategory);
    setOpenEdit(true);
  };

  // Updated filter logic to include status filter
  const filteredSubCategories = subCategories.filter(
    (subCategory) =>
      (subCategory.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false) &&
      (statusFilter === ""
        ? true
        : subCategory.status === (statusFilter === "true"))
  );

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "N/A";
  };

  return (
    <div className="p-6 space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh mục con</h1>

        <Dialog.Root open={openAdd} onOpenChange={setOpenAdd}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {openAdd ? <X size={18} /> : <Plus size={18} />}
              {openAdd ? "Đóng form" : "Thêm danh mục con"}
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
              bg-white p-6 rounded-xl shadow-2xl z-50 w-[90vw] max-w-md"
            >
              <Dialog.Title className="text-xl font-bold">
                Thêm danh mục con
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mb-4">
                Điền thông tin để thêm một danh mục con mới.
              </Dialog.Description>
              <AddSubCategory
                onSuccess={() => {
                  fetchSubCategories();
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
          placeholder="🔍 Tìm kiếm danh mục con..."
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
                  Mã danh mục con
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Tên danh mục con
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Danh mục cha
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
              {filteredSubCategories.map((subCategory) => (
                <tr key={subCategory._id}>
                  <td className="px-6 py-4">{subCategory._id}</td>
                  <td className="px-6 py-4">{subCategory.name || "N/A"}</td>
                  <td className="px-6 py-4">
                    {subCategory.description || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {getCategoryName(subCategory.category)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {subCategory.status ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-4">
                    {subCategory.createdAt
                      ? new Date(subCategory.createdAt).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(subCategory)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(subCategory._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSubCategories.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Không tìm thấy danh mục con nào.
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
              Cập nhật danh mục con
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              Chỉnh sửa thông tin danh mục con.
            </Dialog.Description>
            {editSubCategory && (
              <UpdateSubCategory
                subCategory={editSubCategory}
                onSuccess={() => {
                  fetchSubCategories();
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
