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
  return instance.put(
    `/productmanager/product/updateProduct/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

// Xóa sản phẩm theo ID
export const deleteProduct = (id) => {
  return instance.delete(`/productmanager/product/deleteProduct/${id}`);
};

// Kích hoạt / vô hiệu hóa sản phẩm
export const activeProduct = (id) => {
  return instance.put(`/productmanager/product/activeProduct/${id}`);
};

// Cập nhật tồn kho cho sản phẩm
export const updateStock = (id, stockData) => {
  return instance.put(
    `/productmanager/product/updateStock/${id}`,
    stockData
  );
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

export const updateCategory = (id ,categoryData) => {
  return instance.put(`/productmanager/category/updateCategory/${id}`,categoryData);
}

// SubCategory
export const getAllSubCategories = () => {
  return instance.get("/productmanager/category/getAllSubCategories");
};

export const createSubCategory = (subCategoryData) => {
  return instance.post("/productmanager/category/createSubCategory", subCategoryData);
};

export const updateSubCategory = (id, subCategoryData) => {
  return instance.put(`/productmanager/category/updateSubCategory/${id}`, subCategoryData);
};

export const deleteSubCategory = (id) => {
  return instance.delete(`/productmanager/category/deleteSubCategory/${id}`);
};

export const importProductFromExcel = async (formData) => {
  return await instance.post("/productmanager/product/import-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
