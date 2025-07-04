// Form/AddProduct.jsx
import { useState, useEffect } from "react";
import {
  createProduct,
  getAllSubCategories,
} from "../../../services/Admin/AdminAPI";
import { toast } from "react-toastify";

export default function AddProduct({ onSuccess }) {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    subCategoryId: "",
    origin: "",
    weight: "",
    expiryDate: "",
    image: null,
  });

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await getAllSubCategories();
        if (Array.isArray(res.data.subCategories)) {
          setSubCategories(res.data.subCategories);
          if (res.data.subCategories.length === 0) {
            toast.warn(
              "Không có danh mục con nào, vui lòng tạo danh mục con trước!"
            );
          }
        }
      } catch (error) {
        toast.error("Lỗi khi tải danh mục con!");
      }
    };
    fetchSubCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setProductData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra bắt buộc
    if (!productData.origin || !productData.weight || !productData.expiryDate) {
      toast.error("Vui lòng nhập đầy đủ Xuất xứ, Trọng lượng và Hạn sử dụng");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", productData.name);
    formDataToSend.append("description", productData.description);
    formDataToSend.append("price", productData.price);
    formDataToSend.append("stock", productData.stock);
    formDataToSend.append("subCategoryId", productData.subCategoryId);
    formDataToSend.append("origin", productData.origin);
    formDataToSend.append("weight", productData.weight);
    formDataToSend.append("expiryDate", productData.expiryDate);
    formDataToSend.append("image", productData.image);

    try {
      await createProduct(formDataToSend);
      toast.success("Tạo sản phẩm thành công!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Lỗi khi tạo sản phẩm!");
      console.error("Chi tiết lỗi:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tên sản phẩm
        </label>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Giá</label>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tồn kho
        </label>
        <input
          type="number"
          name="stock"
          value={productData.stock}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Xuất xứ
        </label>
        <input
          type="text"
          name="origin"
          value={productData.origin}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Trọng lượng (g)
        </label>
        <input
          type="number"
          name="weight"
          value={productData.weight}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hạn sử dụng
        </label>
        <input
          type="date"
          name="expiryDate"
          value={productData.expiryDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Danh mục con
        </label>
        <select
          name="subCategoryId"
          value={productData.subCategoryId}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Chọn danh mục con</option>
          {subCategories.map((subCat) => (
            <option key={subCat._id} value={subCat._id}>
              {subCat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hình ảnh
        </label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Đang thêm..." : "Thêm"}
      </button>
    </form>
  );
}
