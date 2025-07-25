import { useState, useEffect } from "react";
import {
  updateProduct,
  getAllSubCategories,
} from "../../../services/Admin/AdminAPI";
import { toast } from "react-toastify";

export default function UpdateProduct({ product, onSuccess }) {
  const [formData, setFormData] = useState({
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
    if (product) {
      setFormData({
        name: product.baseProduct.name || "",
        description: product.baseProduct.description || "",
        price: product.productVariant.price || "",
        stock: product.productVariant.stock || "",
        subCategoryId: product.baseProduct.subCategory?.toString() || "",
        origin: product.baseProduct.origin || "",
        weight: product.productVariant.weight || "",
        expiryDate: product.productVariant.expiryDate
          ? product.productVariant.expiryDate.split("T")[0]
          : "",
        image: null, // ảnh không preload
      });
    }
  }, [product]);

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
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      !formData.subCategoryId ||
      !formData.origin ||
      !formData.weight ||
      !formData.expiryDate
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("subCategoryId", formData.subCategoryId);
      data.append("origin", formData.origin);
      data.append("weight", formData.weight);
      data.append("expiryDate", formData.expiryDate);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await updateProduct(product.baseProduct._id, data);
      toast.success("Cập nhật sản phẩm thành công!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Chi tiết lỗi:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật sản phẩm!"
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
      <h2 className="text-lg font-semibold">Cập nhật Sản Phẩm</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tên sản phẩm
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Giá</label>
        <input
          type="number"
          name="price"
          value={formData.price}
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
          value={formData.stock}
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
          value={formData.origin}
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
          value={formData.weight}
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
          value={formData.expiryDate}
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
          value={formData.subCategoryId}
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
          Hình ảnh (tải lại nếu cần)
        </label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
        />
        {product?.baseProduct?.image?.url && (
          <img
            src={product.baseProduct.image.url}
            alt={product.baseProduct.name}
            className="mt-2 h-20 w-20 object-cover rounded"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Đang cập nhật..." : "Cập nhật"}
      </button>
    </form>
  );
}
