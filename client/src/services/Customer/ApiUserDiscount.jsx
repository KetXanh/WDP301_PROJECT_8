import instance from "../CustomizeApi";

export const getAllUserDiscounts = () => {
  return instance.get('/user/discounts');
};

export const getUserDiscountsByUser = (userId) => {
  return instance.get(`/user/discounts/user/${userId}`);
};

export const addUserDiscount = (data) => {
  return instance.post('/user/discounts', data);
};

export const updateUserDiscount = (id, data) => {
  return instance.put(`/user/discounts/${id}`, data);
};

export const deleteUserDiscount = (id) => {
  return instance.delete(`/user/discounts/${id}`);
}; 