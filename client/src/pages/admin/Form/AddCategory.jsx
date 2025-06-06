import { useState } from "react";
import { createCategory } from "../../../services/Admin/AdminAPI";
import { toast } from "react-toastify";

export default function AddCategory({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(formData);
      toast.success("Thêm danh mục thành công!");
      setFormData({ name: "", description: "", status: true });
      if (onSuccess) onSuccess(); // gọi lại danh sách
    } catch (error) {
      toast.error("Lỗi khi thêm danh mục!");
      console.error("Lỗi tạo danh mục:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow max-w-md"
    >
      <h2 className="text-lg font-semibold">Thêm Danh Mục</h2>

      <div>
        <label className="block font-medium">Tên danh mục</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="status"
          checked={formData.status}
          onChange={handleChange}
        />
        <label>Hoạt động</label>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Thêm
      </button>
    </form>
  );
}
