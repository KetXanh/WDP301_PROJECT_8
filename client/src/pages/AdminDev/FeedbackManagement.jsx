import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Trash2, Filter, Search } from "lucide-react";
import {
  getRatingsByBaseProduct,
  getAllProducts,
  getAllRatings,
  deleteRating,
  exportFeedbackToExcel,
} from "../../services/Admin/AdminAPI";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function FeedbackManagement() {
  const [products, setProducts] = useState([]);
  const [baseProductId, setBaseProductId] = useState("");
  const [starsFilter, setStarsFilter] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const limit = 10;

  // Load danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data.products);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
        toast.error("Lỗi khi tải danh sách sản phẩm");
      }
    };
    fetchProducts();
  }, []);

  // Load đánh giá: toàn bộ hoặc theo sản phẩm
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        let res;
        if (baseProductId) {
          res = await getRatingsByBaseProduct(baseProductId, {
            stars: starsFilter,
            page,
            limit,
          });
        } else {
          res = await getAllRatings({
            stars: starsFilter,
            page,
            limit,
          });
        }
        setRatings(res.data.ratings);
        setTotal(res.data.total);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải đánh giá:", err);
        setError("Không thể tải dữ liệu đánh giá.");
        toast.error("Lỗi khi tải đánh giá");
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [baseProductId, starsFilter, page]);

  const handleDelete = async (ratingId) => {
    if (confirm("Bạn có chắc chắn xoá đánh giá này?")) {
      try {
        await deleteRating(ratingId);
        toast.success("Đã xoá đánh giá");
        setRatings(ratings.filter((r) => r._id !== ratingId));
      } catch (err) {
        console.error("Lỗi khi xoá đánh giá:", err);
        toast.error("Lỗi khi xoá đánh giá");
      }
    }
  };

  const handleExportExcel = async () => {
    if (ratings.length === 0) {
      toast.warning("Không có dữ liệu để xuất Excel!");
      return;
    }

    setExportLoading(true);
    try {
      const response = await exportFeedbackToExcel();
      
      // Tạo blob từ response data
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Tạo URL cho blob
      const url = window.URL.createObjectURL(blob);
      
      // Tạo link để download
      const link = document.createElement('a');
      link.href = url;
      link.download = `danh-sach-danh-gia-${new Date().toISOString().split('T')[0]}.xlsx`;
      
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
  };

  const filteredRatings = ratings.filter((rating) => {
    const userMatch = rating.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const commentMatch = rating.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const productMatch = rating.productBase?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return userMatch || commentMatch || productMatch;
  });

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderStars = (stars) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < stars ? "text-yellow-500" : "text-gray-300"}
            style={{ fontSize: "14px" }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý đánh giá</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi đánh giá của khách hàng ({total} đánh giá)
          </p>
        </div>
        <Button 
          onClick={handleExportExcel} 
          disabled={exportLoading || ratings.length === 0}
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

      {/* Bộ lọc và tìm kiếm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tìm kiếm */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo người dùng, bình luận, sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bộ lọc sản phẩm và sao */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="font-medium text-sm">Sản phẩm:</label>
              <select
                value={baseProductId}
                onChange={(e) => {
                  setBaseProductId(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả sản phẩm</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-medium text-sm">Lọc sao:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setStarsFilter(starsFilter === star ? null : star);
                      setPage(1);
                    }}
                    className={`flex items-center gap-1 px-3 py-1 border rounded-md transition-colors ${
                      starsFilter === star 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {[...Array(star)].map((_, i) => (
                      <FaStar
                        key={i}
                        className="text-yellow-500"
                        style={{ fontSize: "12px" }}
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách đánh giá */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đánh giá</CardTitle>
          <CardDescription>
            Tổng quan các đánh giá của khách hàng
          </CardDescription>
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
            ) : filteredRatings.length > 0 ? (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đánh giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bình luận
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đánh giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRatings.map((rating, index) => (
                      <tr key={rating._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rating.user?.username || "Ẩn danh"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rating.productBase?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {renderStars(rating.stars)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="break-words">
                            {rating.comment || "Không có bình luận"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(rating.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(rating._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Phân trang */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Trang trước
                    </Button>
                    <span className="text-sm">
                      Trang {page} / {totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Trang sau
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Không có đánh giá nào để hiển thị.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 