import { Eye, Trash2, Filter, Plus, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../services/Admin/AdminAPI";
import * as Dialog from "@radix-ui/react-dialog";
import AddProduct from "./Form/AddProduct";
import UpdateProduct from "./Form/UpdateProduct";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const flattenProducts = (products) => {
    const flattened = [];
    products.forEach((product) => {
      if (product.variants.length === 0) {
        flattened.push({
          ...product,
          price: null,
          stock: null,
          variantId: null,
          baseProduct: product,
          productVariant: { _id: null, price: null, stock: null },
        });
      } else {
        product.variants.forEach((variant) => {
          flattened.push({
            ...product,
            price: variant.price,
            stock: variant.stock,
            variantId: variant._id,
            baseProduct: product,
            productVariant: variant,
          });
        });
      }
    });
    return flattened;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      const flat = flattenProducts(res.data.products);
      setProducts(flat);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
      }
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const filteredProducts = products.filter((p) =>
    p.baseProduct.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product</h1>
        <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <Plus size={18} />
              Add
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-50 w-[90vw] max-w-md min-h-[60vh] max-h-[80vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-bold">
                Thêm sản phẩm
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mb-4">
                Điền thông tin để thêm một sản phẩm mới.
              </Dialog.Description>
              <AddProduct
                onSuccess={() => {
                  fetchProducts();
                  setIsAddModalOpen(false);
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
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Tên
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Giá
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Tồn kho
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
            {filteredProducts.map((product, index) => (
              <tr
                key={
                  product.baseProduct._id + "-" + (product.variantId || index)
                }
              >
                <td className="px-6 py-4">{product.baseProduct.name}</td>
                <td className="px-6 py-4">
                  <img
                    src={product.baseProduct.image?.url}
                    alt={product.baseProduct.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  {product.price !== null
                    ? `${product.price.toLocaleString()} đ`
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  {product.stock !== null ? product.stock : "—"}
                </td>
                <td className="px-6 py-4">
                  {new Date(product.baseProduct.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(product)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(product.baseProduct._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-50 w-[90vw] max-w-md min-h-[60vh] max-h-[80vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold">
              Cập nhật sản phẩm
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              Chỉnh sửa thông tin sản phẩm.
            </Dialog.Description>
            {selectedProduct && (
              <UpdateProduct
                product={selectedProduct}
                onSuccess={() => {
                  fetchProducts();
                  setIsEditModalOpen(false);
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
