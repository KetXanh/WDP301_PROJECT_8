import instance from "../CustomizeApi"

export const getAllDiscounts = () => {
    return instance.get('/saleManager/discount');
}
