import { useState, useEffect } from "react";
import {
  updateSubCategory,
  getAllCategories,
} from "../../../services/Admin/AdminAPI";
import { toast } from "react-toastify";

export default function UpdateSubCategory({ subCategory, onSuccess }) {
  const [formData, setFormData] = useState({
    name: subCategory.name,
    description: subCategory.description,
    categoryId: subCategory.category, // API trả về category
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
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
    setLoading(true);
    setError(null);
    try {
      console.log("Dữ liệu gửi lên:", formData); // Log dữ liệu gửi
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Log token để kiểm tra
      if (!token) {
        toast.error("Không tìm thấy token, vui lòng đăng nhập lại!");
        return;
      }
      await updateSubCategory(subCategory._id, formData);
      toast.success("Cập nhật danh mục con thành công!");
      onSuccess();
    } catch (err) {
      console.error("Chi tiết lỗi:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      }); // Log chi tiết lỗi
      setError(err.response?.data?.message || "Cập nhật danh mục con thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block font-semibold mb-1">Tên danh mục con</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Danh mục cha</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
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
        {loading ? "Đang cập nhật..." : "Cập nhật"}
      </button>
    </form>
  );
}
