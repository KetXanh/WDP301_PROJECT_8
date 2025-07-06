import { useEffect, useState } from "react";
import {
  getRatingsByBaseProduct,
  getAllProducts,
  deleteRating,
} from "../../services/Admin/AdminAPI";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { FaStar } from "react-icons/fa";


function Rating() {
  const [products, setProducts] = useState([]);
  const [baseProductId, setBaseProductId] = useState("");
  const [starsFilter, setStarsFilter] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Load danh sách sản phẩm
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getAllProducts();
        setProducts(res.data.products);
        if (res.data.length > 0) setBaseProductId(res.data[0]._id);
      } catch (err) {
        toast.error("Lỗi khi tải danh sách sản phẩm");
      }
    }
    fetchProducts();
  }, []);

  // Load đánh giá theo sản phẩm và bộ lọc
  useEffect(() => {
    if (!baseProductId) return;
    async function fetchRatings() {
      try {
        const res = await getRatingsByBaseProduct(baseProductId, {
          stars: starsFilter,
          page,
          limit,
        });
        setRatings(res.data.ratings);
        setTotal(res.data.total);
      } catch (err) {
        toast.error("Lỗi khi tải đánh giá");
      }
    }
    fetchRatings();
  }, [baseProductId, starsFilter, page]);

  const handleDelete = async (ratingId) => {
    if (confirm("Bạn có chắc chắn xoá đánh giá này?")) {
      try {
        await deleteRating(ratingId);
        toast.success("Đã xoá đánh giá");
        setRatings(ratings.filter((r) => r._id !== ratingId));
      } catch (err) {
        toast.error("Lỗi khi xoá đánh giá");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 mt-10">
      <h1 className="text-2xl font-bold mb-4">Quản lý đánh giá sản phẩm</h1>

      {/* Lọc theo sản phẩm */}
      <div className="mb-4 flex gap-4 items-center">
        <label className="font-medium">Sản phẩm:</label>
        <select
          value={baseProductId}
          onChange={(e) => setBaseProductId(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        {/* Lọc theo số sao */}
        <label className="ml-6 font-medium">Lọc sao:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setStarsFilter(star)}
            className={`flex items-center gap-1 px-3 py-1 border rounded mx-1 ${
              starsFilter === star ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {[...Array(star)].map((_, i) => (
              <FaStar
                key={i}
                className="text-yellow-500"
                style={{ fontSize: "14px" }}
              />
            ))}
          </button>
        ))}

        {starsFilter && (
          <button
            onClick={() => setStarsFilter(null)}
            className="text-sm underline ml-2"
          >
            Bỏ lọc
          </button>
        )}
      </div>

      {/* Danh sách đánh giá */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Người dùng</th>
            <th>Sao</th>
            <th>Bình luận</th>
            <th>Ngày</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ratings.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Không có đánh giá
              </td>
            </tr>
          ) : (
            ratings.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="p-2">{r.user?.username || "Ẩn danh"}</td>
                <td className="text-center">
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < r.stars ? "text-yellow-500" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </td>

                <td>{r.comment}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td className="text-center">
                  <button onClick={() => handleDelete(r._id)}>
                    <Trash2 className="text-red-500 w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(total / limit) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 mx-1 border rounded ${
              page === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Rating;
