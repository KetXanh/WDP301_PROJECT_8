// services/AdminApi.jsx
import instance from "../CustomizeApi";

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = () => {
  return instance.get("/productmanager/product/getAllProducts");
};

// Lấy chi tiết sản phẩm theo ID
export const getProductById = (id) => {
  return instance.get(`/productmanager/product/getProductById/${id}`);
};

// Tạo sản phẩm mới (multipart/form-data)
export const createProduct = (formData) => {
  return instance.post("/productmanager/product/createProduct", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Cập nhật sản phẩm theo ID
export const updateProduct = (id, formData) => {
  return instance.put(`/productmanager/product/updateProduct/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Xóa sản phẩm theo ID
export const deleteProduct = (id) => {
  return instance.delete(`/productmanager/product/deleteProduct/${id}`);
};

// Kích hoạt / vô hiệu hóa sản phẩm
export const activeProduct = (id, status) => {
  return instance.put(`/productmanager/product/activeProduct/${id}`, {
    status,
  });
};

export const updateStock = (id, stockData) => {
  return instance.put(`/productmanager/product/updateStock/${id}`, stockData);
};

// Lấy tổng số lượng tồn kho
export const getTotalStock = () => {
  return instance.get("/productmanager/product/total-stock");
};

//Category
export const getAllCategories = () => {
  return instance.get("/productmanager/category/getAllCategories");
};

export const deleteCategory = (id) => {
  return instance.delete(`/productmanager/category/deleteCategory/${id}`);
};

export const createCategory = (categoryData) => {
  return instance.post("/productmanager/category/createCategory", categoryData);
};

export const updateCategory = (id, categoryData) => {
  return instance.put(
    `/productmanager/category/updateCategory/${id}`,
    categoryData
  );
};

// SubCategory
export const getAllSubCategories = () => {
  return instance.get("/productmanager/category/getAllSubCategories");
};

export const createSubCategory = (subCategoryData) => {
  return instance.post(
    "/productmanager/category/createSubCategory",
    subCategoryData
  );
};

export const updateSubCategory = (id, subCategoryData) => {
  return instance.put(
    `/productmanager/category/updateSubCategory/${id}`,
    subCategoryData
  );
};

export const deleteSubCategory = (id) => {
  return instance.delete(`/productmanager/category/deleteSubCategory/${id}`);
};

export const importProductFromExcel = async (formData) => {
  return await instance.post("/productmanager/product/import-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// API cho AdminDev
// Lấy danh sách tất cả người dùng
export const getAllUser = () => {
  return instance.get("/admin/getAllUser");
};

// Biểu đồ thống kê người dùng 
export const getUserStats = () => {
  return instance.get("/admin/stats");
};

// Thay đổi vai trò của người dùng
export const changeRole = (id, data, token) => {
  return instance.put(`/admin/changeRole/${id}`, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const exportProductToExcel = async () => {
  return await instance.get("/productmanager/product/export-excel", {
    responseType: "blob",
  });
};
export const getCategoryStats = () => {
  return instance.get("/productmanager/category/category-stats");
};

export const getProductCountByCategory = () => {
  return instance.get("/productmanager/category/product-by-category");
};

export const getAllOrders = () => {
  return instance.get("productmanager/product/orders");
};

export const updateOrderSatatus = (orderId, status) => {
  return instance.put(`productmanager/product/order/status/${orderId}`, {
    status,
  });
};

export const getOrderDetailByID = (orderId) => {
  return instance.get(`productmanager/product/orders/${orderId}`);
};

export const getTotalOrders = async () => {
    return instance.get("productmanager/product/orders/total"); 
};


export const getAllRatings = (params) => {
  return instance.get("/productmanager/rating/ratings", { params });
};


export const addRating = (data) => {
  return instance.post("/productmanager/rating/add", data);
};


export const deleteRating = (ratingId) => {
  return instance.delete(`/productmanager/rating/ratings/${ratingId}`);
};


export const getRatingStats = (productId) => {
  return instance.get(`/productmanager/rating/ratings/${productId}/stats`);
};


export const getRatingsByBaseProduct = (baseProductId, params) => {
  return instance.get(`/productmanager/rating/ratings/${baseProductId}`, {
    params,
  });
};


// Cấm người dùng
export const banUser = (id) => {
  return instance.patch(`/admin/ban/${id}`);
};
// Bỏ cấm người dùng
export const unbanUser = (id) => {
  return instance.patch(`/admin/unban/${id}`);
};

//Lấy danh sách tất cả sản phẩm
export const getAllProduct = () => {
  return instance.get("/admin/getAllProduct");
};

//BLOG API CHO ADMIN DEV=============================================

// Lấy danh sách blog
export const getAllBlogs = async () => {
  try {
    const response = await instance.get("/blog");
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

// Lấy chi tiết blog theo ID
export const getBlogDetail = (id) => {
  return instance.get(`/blog/${id}`);
};
 
// Tạo blog mới
export const createBlog = (blogData) => {
  const token = localStorage.getItem("token");
  return instance.post("/blog", blogData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Cập nhật blog
export const updateBlog = (id, blogData) => {
  const token = localStorage.getItem("accessToken");
  return instance.put(`/blog/${id}`, blogData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

// Xóa blog
export const deleteBlog = (id) => {
  const token = localStorage.getItem("token");
  return instance.delete(`/blog/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Thêm comment cho blog
export const addComment = (id, commentData) => {
  return instance.post(`/blog/${id}/comments`, commentData);
};

// Cập nhật comment
export const updateComment = (blogId, commentId, commentData) => {
  return instance.put(`/blog/${blogId}/comments/${commentId}`, commentData);
};

// Xóa comment khỏi blog
export const deleteComment = (blogId, commentId) => {
  return instance.delete(`/blog/${blogId}/comments/${commentId}`);
};
