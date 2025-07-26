import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Edit, Trash2, X } from "lucide-react"
import { getAllProduct, updateBaseProduct, getAllSubCategories, exportProductToExcel } from "../../services/Admin/AdminAPI";
import { toast } from "react-toastify";


export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    origin: "",
    subCategoryId: ""
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProduct();
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError("Không thể tải dữ liệu sản phẩm.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await getAllSubCategories();
        if (response.data && response.data.subCategories) {
          setSubCategories(response.data.subCategories);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục con:", err);
      }
    };
    fetchSubCategories();
  }, []);

  const handleExportExcel = async () => {
    if (products.length === 0) {
      toast.warning("Không có dữ liệu để xuất Excel!");
      return;
    }

    setExportLoading(true);
    try {
      const response = await exportProductToExcel();
      
      // Tạo blob từ response data
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Tạo URL cho blob
      const url = window.URL.createObjectURL(blob);
      
      // Tạo link để download
      const link = document.createElement('a');
      link.href = url;
      link.download = `danh-sach-san-pham-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Xuất Excel thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      toast.error("Lỗi khi xuất file Excel!");
    } finally {
      setExportLoading(false);
    }
  }

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name || "",
      description: product.description || "",
      origin: product.origin || "",
      subCategoryId: product.subCategory?._id || ""
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.name || !editFormData.description || !editFormData.origin || !editFormData.subCategoryId) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await updateBaseProduct(selectedProduct._id, editFormData);
      toast.success("Cập nhật sản phẩm thành công!");
      setIsEditModalOpen(false);
      
      // Refresh products list
      const response = await getAllProduct();
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật sản phẩm!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin và trạng thái của các sản phẩm
          </p>
        </div>
        <Button 
          onClick={handleExportExcel} 
          disabled={exportLoading || products.length === 0}
          className="flex items-center gap-2"
        >
          {exportLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang xuất...</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-4 w-4" />
              <span>Xuất Excel</span>
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>Tổng quan các sản phẩm trong hệ thống ({products.length} sản phẩm)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Đang tải dữ liệu...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              products && products.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xuất xứ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, index) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.image && product.image.url ? (
                            <img 
                              src={product.image.url} 
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">No img</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-gray-900 break-words">{product.name}</div>
                            <div className="text-sm text-gray-500 break-words mt-1">{product.description}</div>
                            <div className="text-xs text-gray-400 mt-1">Slug: {product.slug}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm text-gray-900 break-words">{product.subCategory?.name || "N/A"}</div>
                            <div className="text-xs text-gray-500 break-words mt-1">{product.subCategory?.description || ""}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.origin || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(product.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditClick(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không có sản phẩm nào để hiển thị.</p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chỉnh sửa sản phẩm</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xuất xứ *
                </label>
                <input
                  type="text"
                  name="origin"
                  value={editFormData.origin}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục con *
                </label>
                <select
                  name="subCategoryId"
                  value={editFormData.subCategoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục con</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  Cập nhật
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}