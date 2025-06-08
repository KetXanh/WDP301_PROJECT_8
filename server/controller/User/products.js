const productBase = require("../../models/product/productBase")
const ProductVariant = require("../../models/product/ProductVariant")
const { SubCategory } = require("../../models/product/subCategory")


//[GET] /user/products
module.exports.allProducts = async (req, res) => {
    try {
        const products = await ProductVariant.find({
            stock: { $gte: 0 }
        }).populate({
            path: 'baseProduct',
            populate:
                { path: 'subCategory', select: '-createdBy' }
        })



        res.json({
            code: 200,
            products
        })
    } catch (error) {
        console.error('Lỗi lấy products:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}