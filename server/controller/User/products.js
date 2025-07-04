const { Category } = require("../../models/product/category")
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
                { path: 'subCategory', select: '-createdBy', populate: { path: 'category', select: 'name description' } }
        }).sort({ createdAt: -1 })
        const formatProduct = products.map((p) => ({
            _id: p._id,
            image: p?.baseProduct?.image?.url,
            name: p?.baseProduct?.name,
            description: p.baseProduct?.description,
            slug: p.baseProduct?.slug,
            price: p.price,
            stock: p.stock,
            category: {
                name: p.baseProduct.subCategory.category.name,
                description: p.baseProduct.subCategory.category.description
            },
            subCategory: {
                name: p.baseProduct.subCategory.name,
                description: p.baseProduct.subCategory.description
            },
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
        }))

        res.json({
            code: 200,
            data: formatProduct
        })
    } catch (error) {
        console.error('Lỗi lấy products:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}


//[GET] /user/products/:slug
module.exports.detailProducts = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                code: 400,
                message: "Not find slug"
            });
        }

        const productV = await ProductVariant.find({
            stock: { $gte: 0 },
        }).populate({
            path: 'baseProduct',
            populate: {
                path: 'subCategory',
                select: '-createdBy',
                populate: {
                    path: 'category',
                    select: 'name description'
                }
            }
        });

        const product = productV.find(p => p.baseProduct?.slug.toLowerCase() === slug.toLowerCase())

        if (!product) {
            return res.status(404).json({
                code: 404,
                message: "product not found"
            });
        }

        const formatProduct = {
            _id: product._id,
            name: product?.baseProduct?.name,
            description: product?.baseProduct?.description,
            image: product?.baseProduct?.image?.url,
            slug: product?.baseProduct?.slug,
            price: product?.price,
            stock: product?.stock,
            category: {
                name: product?.baseProduct?.subCategory?.category?.name,
                description: product?.baseProduct?.subCategory?.category?.description
            },
            subCategory: {
                name: product?.baseProduct?.subCategory?.name,
                description: product?.baseProduct?.subCategory?.description
            },
            createdAt: product?.createdAt,
            updatedAt: product?.updatedAt
        };

        return res.json({
            code: 200,
            data: formatProduct
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
            error: error.message
        });
    }
};


//[GET] user/products/categories
module.exports.allCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: true }).lean();
        const subCategories = await SubCategory.find({ status: true }).lean();
        const grouped = categories.map(cat => {
            const children = subCategories
                .filter(sub => sub.category?.toString() === cat._id.toString())
                .map(sub => ({
                    id: sub.slug || sub._id,
                    name: sub.name,
                }));

            return {
                id: cat.slug || cat._id,
                name: cat.name,
                children,
            };
        });

        res.json({
            code: 200,
            data: grouped
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
            error: error.message,
        });
    }
}

// [GET] user/products/sort/:sort
module.exports.sortProduct = async (req, res) => {
    try {
        const { sort } = req.params;
        const productsV = await ProductVariant.find({
            stock: { $gte: 0 },
        }).populate({
            path: 'baseProduct',
            populate: {
                path: 'subCategory',
                select: '-createdBy',
                populate: {
                    path: 'category',
                    select: 'name description'
                }
            }
        });
        switch (sort) {
            case "A-Z":
                productsV.sort((a, b) => {
                    const nameA = a.baseProduct?.name?.toLowerCase() || '';
                    const nameB = b.baseProduct?.name?.toLowerCase() || '';
                    return nameA.localeCompare(nameB);
                });
                break;
            case "Z-A":
                productsV.sort((a, b) => {
                    const nameA = a.baseProduct?.name?.toLowerCase() || '';
                    const nameB = b.baseProduct?.name?.toLowerCase() || '';
                    return nameB.localeCompare(nameA);
                });
                break;
            case "price-in":
                productsV.sort((a, b) => a.price - b.price);
                break;
            case "price-de":
                productsV.sort((a, b) => b.price - a.price);
                break;

            default:
                res.json({
                    code: 400,
                    message: "Not find sort option"
                })
                return;
        }


        const formatProduct = productsV.map(product => ({
            id: product._id,
            name: product?.baseProduct?.name,
            description: product?.baseProduct?.description,
            imageUrl: product?.baseProduct?.image?.url,
            slug: product?.baseProduct?.slug,
            price: product?.price,
            stock: product?.stock,
            category: {
                name: product?.baseProduct?.subCategory?.category?.name,
                description: product?.baseProduct?.subCategory?.category?.description
            },
            subCategory: {
                name: product?.baseProduct?.subCategory?.name,
                description: product?.baseProduct?.subCategory?.description
            },
            createdAt: product?.createdAt,
            updatedAt: product?.updatedAt
        }));

        return res.json({
            code: 200,
            data: formatProduct
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
            error: error.message
        });
    }
}

//[GET] user/products/search/:search
module.exports.searchProduct = async (req, res) => {
    try {
        const { search } = req.params;
        const baseProducts = await productBase.find({
            name: { $regex: search, $options: 'i' }
        });
        const baseProductIds = baseProducts.map(bp => bp._id);
        const productsV = await ProductVariant.find({
            baseProduct: { $in: baseProductIds },
            stock: { $gte: 0 },
        }).populate({
            path: 'baseProduct',
            populate: {
                path: 'subCategory',
                select: '-createdBy',
                populate: {
                    path: 'category',
                    select: 'name description'
                }
            }
        });

        const formatProduct = productsV.map(product => ({
            id: product._id,
            name: product?.baseProduct?.name,
            description: product?.baseProduct?.description,
            imageUrl: product?.baseProduct?.image?.url,
            slug: product?.baseProduct?.slug,
            price: product?.price,
            stock: product?.stock,
            category: {
                name: product?.baseProduct?.subCategory?.category?.name,
                description: product?.baseProduct?.subCategory?.category?.description
            },
            subCategory: {
                name: product?.baseProduct?.subCategory?.name,
                description: product?.baseProduct?.subCategory?.description
            },
            createdAt: product?.createdAt,
            updatedAt: product?.updatedAt
        }));

        return res.json({
            code: 200,
            data: formatProduct
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
            error: error.message
        });
    }
}