import instance from "../CustomizeApi"

export const allProducts = () => {
    return instance.get('/user/products')
}

export const detailProduct = (slug) => {
    return instance.get(`/user/products/${slug}`)
}

export const address = () => {
    return instance.get(`/user/auth/address`)
}

export const userOrder = (items, shippingAddress, paymentMethod, note) => {
    return instance.post('/user/orders', { items, shippingAddress, paymentMethod, note })
}

export const getOrderById = (id) => {
    return instance.get(`/user/orders/${id}`)
}

export const getOrderByUser = () => {
    return instance.get(`/user/orders/order-history`)
}

export const getCategories = () => {
    return instance.get(`/user/products/categories`)
}

export const sortProduct = (sort) => {
    return instance.get(`/user/products/sort/${sort}`)
}

export const searchProduct = (search) => {
    return instance.get(`/user/products/search/${search}`)
}

export const addItemToCart = (productId, quantity, price) => {
    return instance.post(`/user/carts`, { productId, quantity, price })
}

export const increItemToCart = (productId) => {
    return instance.put(`/user/carts/incre-item/${productId}`)
}

export const decreItemToCart = (productId) => {
    return instance.put(`/user/carts/decre-item/${productId}`)
}

export const removeItemToCart = (productId) => {
    return instance.delete(`/user/carts/remove-item/${productId}`)
}

export const getAllItemCart = () => {
    return instance.get(`/user/carts/user-cart`)
}

export const removeMultiItemToCart = (productIds) => {
    return instance.delete(`/user/carts/items`, {
        data: { productIds }
    })
}

export const addNewAddress = (addressData) => {
    return instance.post(`/user/carts/new-address`, addressData)
}

export const deleteAddress = (addressId) => {
    return instance.delete(`/user/carts/delete-address/${addressId}`)
}

export const addRating = (data) => {
  return instance.post("/productmanager/rating/add", data);
};

export const addRatingUser = (data) => {
  return instance.post("/user/ratings/add", data);
};


