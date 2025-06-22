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

export const userOrder = (items, shippingAddress) => {
    return instance.post('/user/orders', { items, shippingAddress })
}