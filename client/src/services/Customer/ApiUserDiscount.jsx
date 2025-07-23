import instance from "../CustomizeApi";

// Lấy danh sách discount của user
export const getUserDiscounts = () => {
  return instance.get('/user/discounts/discounts');
};

// Gán discount cho user
export const assignDiscountToUser = (discountId) => {
  return instance.post('/user/assign', { discountId });
};

// Xóa discount khỏi user
export const removeUserDiscount = (discountId) => {
  return instance.delete(`/user/remove/${discountId}`);
};

// User sử dụng mã giảm giá
export const useUserDiscount = (discountId) => {
  return instance.post('/user/use', { discountId });
};

// Thêm số lượt quay discount
export const addReceivableDiscount = (quantity) => {
  return instance.post('/user/receivable', { quantity });
};

// Cập nhật trạng thái các discount sắp hết hạn
export const updateExpiringDiscounts = () => {
  return instance.post('/user/update-expiring');
};

// Lấy các discount sắp hết hạn của người dùng
export const notifyExpiringDiscounts = (hours = 24) => {
  return instance.get(`/user/notify-expiring?hours=${hours}`);
}; 