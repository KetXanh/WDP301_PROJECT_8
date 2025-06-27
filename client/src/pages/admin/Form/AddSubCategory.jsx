import { useState, useEffect } from "react";
import {
  createSubCategory,
  getAllCategories,
} from "../../../services/Admin/AdminAPI";
import { toast } from "react-toastify";

export default function AddSubCategory({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
          if (res.data.categories.length === 0) {
            toast.warn(
              "Không có danh mục cha nào, vui lòng tạo danh mục cha trước!"
            );
          }
        }
      } catch (error) {
        toast.error("Lỗi khi tải danh mục cha!");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) {
      toast.error("Vui lòng điền đầy đủ tên và danh mục cha!");
      return;
    }
    setLoading(true);
    try {
      console.log("Dữ liệu gửi lên:", formData); // Log dữ liệu gửi
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Log token để kiểm tra
      if (!token) {
        toast.error("Không tìm thấy token, vui lòng đăng nhập lại!");
        return;
      }
      await createSubCategory(formData);
      toast.success("Thêm danh mục con thành công!");
      setFormData({ name: "", description: "", categoryId: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Chi tiết lỗi:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      }); // Log chi tiết lỗi
      toast.error(
        error.response?.data?.message || "Lỗi khi thêm danh mục con!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow max-w-md"
    >
      <h2 className="text-lg font-semibold">Thêm Danh Mục Con</h2>

      <div>
        <label className="block font-medium">Tên danh mục con</label>
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

      <div>
        <label className="block font-medium">Danh mục cha</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Chọn danh mục cha</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Đang thêm..." : "Thêm"}
      </button>
    </form>
  );
}
