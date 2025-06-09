const BaseProduct = require("../../models/product/productBase");
const ProductVariant = require("../../models/product/ProductVariant");
const { SubCategory } = require("../../models/product/subCategory");
const { cloudinary } = require("../../middleware/upload.middleware")
const { upload } = require('../../middleware/upload.middleware');

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await BaseProduct.find();
        const productsWithVariants = await Promise.all(
            products.map(async (product) => {
                const variants = await ProductVariant.find({ baseProduct: product._id });
                return {
                    ...product.toObject(),
                    variants
                };
            })
        );
        
        res.status(200).json({
            message: "Products fetched successfully !!!",
            products: productsWithVariants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await BaseProduct.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const variants = await ProductVariant.find({ baseProduct: id });
        const productWithVariants = {
            ...product.toObject(),
            variants
        };

        res.status(200).json({ 
            message: "Product fetched successfully !!!", 
            product: productWithVariants 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getProductBySubCategory = async (req, res) => {
    try {
        const { subCategoryId } = req.params;
        const products = await BaseProduct.find({ subCategory: subCategoryId }).populate('variants');
        res.status(200).json({ message: "Products fetched successfully !!!", products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getTop8Products = async (req, res) => {
    try {
        const products = await BaseProduct.find().sort({ createdAt: -1 }).limit(8);
        const productsWithVariants = await Promise.all(
            products.map(async (product) => {
                const variants = await ProductVariant.find({ baseProduct: product._id });
                return {
                    ...product.toObject(),
                    variants
                };
            })
        );
        res.status(200).json({ 
            message: "Top 8 products fetched successfully !!!", 
            products: productsWithVariants 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getProductByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await BaseProduct.find({ category: categoryId }).populate('variants');
        res.status(200).json({ message: "Products fetched successfully !!!", products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.createProduct = async (req, res) => {
  try {
    const user = req.user;
    const { name, description, price, stock, subCategoryId } = req.body;

    if (!name || !description || !price || !stock || !subCategoryId) {
      return res.status(400).json({
        message:
          "Name, description, price, stock and subCategoryId are required",
      });
    }

    // Kiểm tra danh mục con
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub category not found" });
    }

    // Kiểm tra file ảnh
    if (
      !req.files ||
      !req.files.image ||
      !Array.isArray(req.files.image) ||
      req.files.image.length === 0
    ) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Lấy ảnh
    const image = {
      url: req.files.image[0].path,
      public_id: req.files.image[0].filename,
    };

    // Tạo baseProduct
    const baseProduct = new BaseProduct({
      name,
      description,
      image,
      subCategory: subCategoryId,
      createdBy: user.id,
    });

    await baseProduct.save();

    // Tạo variant
    const productVariant = new ProductVariant({
      baseProduct: baseProduct._id,
      price,
      stock,
    });

    await productVariant.save();

    return res.status(201).json({
      message: "Product created successfully!",
      baseProduct,
      productVariant,
    });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error); // logging
    return res.status(500).json({ message: error.message });
  }
};


module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, subCategoryId } = req.body;
        const existingProduct = await BaseProduct.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const subCategory = await SubCategory.findById(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: "Sub category not found" });
        }

        if (!name || !description || !subCategoryId) {
            return res.status(400).json({ message: "Name, description and subCategoryId are required" });
        }

        let image = existingProduct.image;
        if (req.files && req.files.image) {
            if (existingProduct.image && existingProduct.image.public_id) {
                await cloudinary.uploader.destroy(existingProduct.image.public_id);
            }
            image = {
                url: req.files.image[0].path,
                public_id: req.files.image[0].filename,
            };
        }

        const updatedBaseProduct = await BaseProduct.findByIdAndUpdate(
            id,
            {
                name,
                description,
                subCategory: subCategoryId,
                image
            },
            { new: true }
        );

        res.status(200).json({
            message: "Product updated successfully !!!",
            product: updatedBaseProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const existingProduct = await BaseProduct.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete all variants first
        await ProductVariant.deleteMany({ baseProduct: id });

        // Then delete the base product
        await BaseProduct.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully !!!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.activeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status || !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ 
                message: "Status is required and must be either 'active' or 'inactive'" 
            });
        }

        const variants = await ProductVariant.find({ baseProduct: id });
        const baseProduct = await BaseProduct.findById(id);

        if (!baseProduct || !variants || variants.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        let message;
        let updatedVariants = [];

        for (let variant of variants) {
            const currentStock = variant.stock;
            let newStock;

            if (status === 'inactive') {
                if (currentStock > 0) {
                    newStock = -currentStock;
                } else if (currentStock === 0) {
                    newStock = -9999;
                } else {
                    newStock = currentStock;
                }
            } else {
                if (currentStock === -9999) {
                    newStock = 0;
                } else if (currentStock < 0) {
                    newStock = Math.abs(currentStock);
                } else {
                    newStock = currentStock;
                }
            }

            const updatedVariant = await ProductVariant.findByIdAndUpdate(
                variant._id,
                { stock: newStock },
                { new: true }
            );
            updatedVariants.push(updatedVariant);
        }

        const firstVariant = updatedVariants[0];
        if (status === 'active') {
            if (firstVariant.stock > 0) {
                message = `Product is now in business with ${firstVariant.stock} items in stock`;
            } else {
                message = "Product is now in business but out of stock";
            }
        } else {
            if (firstVariant.stock === -9999) {
                message = "Product is now out of business and out of stock";
            } else {
                message = `Product is now out of business with ${Math.abs(firstVariant.stock)} items in stock`;
            }
        }

        res.status(200).json({
            message,
            product: baseProduct,
            variants: updatedVariants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStock, newPrice } = req.body;

        if (!newStock || !newPrice) {
            return res.status(400).json({
                message: "newStock and newPrice are required"
            });
        }

        // Tìm tất cả các biến thể của sản phẩm
        const existingVariants = await ProductVariant.find({ baseProduct: id }).populate('baseProduct');
        
        if (!existingVariants || existingVariants.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Kiểm tra xem có biến thể nào có giá bằng giá mới không
        const existingVariantWithSamePrice = existingVariants.find(variant => 
            Number(variant.price) === Number(newPrice)
        );

        if (existingVariantWithSamePrice) {
            // Nếu tìm thấy biến thể có cùng giá, cập nhật số lượng
            const updatedStock = Number(existingVariantWithSamePrice.stock) + Number(newStock);
            const updatedProduct = await ProductVariant.findByIdAndUpdate(
                existingVariantWithSamePrice._id,
                { stock: updatedStock },
                { new: true }
            );

            return res.status(200).json({
                message: "Stock updated successfully for existing price variant",
                product: updatedProduct,
                totalStock: updatedStock
            });
        } else {
            // Nếu không tìm thấy biến thể có cùng giá, tạo biến thể mới
            const newVariant = new ProductVariant({
                baseProduct: id,
                price: newPrice,
                stock: newStock
            });

            await newVariant.save();

            // Lấy lại tất cả các biến thể sau khi thêm mới
            const allVariants = await ProductVariant.find({ baseProduct: id }).populate('baseProduct');

            // Tính tổng số lượng của tất cả các biến thể
            const totalStock = allVariants.reduce((sum, variant) => sum + Number(variant.stock), 0);

            return res.status(200).json({
                message: "New product variant created successfully",
                product: newVariant,
                allVariants: allVariants,
                totalStock: totalStock
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getTotalStock = async (req, res) => {
    try {
        const variants = await ProductVariant.find({ stock: { $gt: 0 } });

        // Tính tổng stock
        const totalStock = variants.reduce(
            (acc, variant) => acc + variant.stock,
            0
        );

        res.status(200).json({
            message: "Total stock calculated successfully",
            totalStock,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.consolidateProductVariants = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Lấy thông tin sản phẩm và tất cả biến thể
        const baseProduct = await BaseProduct.findById(id);
        const variants = await ProductVariant.find({ baseProduct: id });

        if (!baseProduct || !variants || variants.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Hiển thị thông tin sản phẩm và các biến thể cũ
        const oldVariants = variants.map(v => ({
            price: v.price,
            stock: v.stock,
            totalValue: v.price * v.stock
        }));

        // 2. Tính toán và tạo biến thể mới
        // Tính tổng số lượng và tổng giá trị
        const totalStock = variants.reduce((sum, variant) => sum + Math.abs(variant.stock), 0);
        const totalValue = variants.reduce((sum, variant) => sum + (variant.price * Math.abs(variant.stock)), 0);
        
        // Tính giá trung bình mới
        const newPrice = Math.round(totalValue / totalStock);

        // Xóa tất cả các biến thể cũ
        await ProductVariant.deleteMany({ baseProduct: id });

        // Tạo biến thể mới với giá và số lượng đã gộp
        const newVariant = new ProductVariant({
            baseProduct: id,
            price: newPrice,
            stock: totalStock
        });

        await newVariant.save();

        return res.status(200).json({
            message: "Product variants consolidated successfully",
            productInfo: {
                productName: baseProduct.name,
                oldVariants: oldVariants,
                newVariant: {
                    price: newPrice,
                    stock: totalStock,
                    totalValue: newPrice * totalStock
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



