const { Product } = require("../../models/product/product");
const { SubCategory } = require("../../models/product/subCategory");
const { cloudinary } = require("../../middleware/upload.middleware")
const { upload } = require('../../middleware/upload.middleware');

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            message: "Products fetched successfully !!!",
            products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json({ message: "Product fetched successfully !!!", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getProductBySubCategory = async (req, res) => {
    try {
        const { subCategoryId } = req.params;
        const products = await Product.find({ subCategory: subCategoryId });
        res.status(200).json({ message: "Products fetched successfully !!!", products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getProductByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ category: categoryId });
        res.status(200).json({ message: "Products fetched successfully !!!", products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.createProduct = async (req, res) => {
    console.log('====================================');
    console.log(req.body);
    console.log(JSON.stringify(req.files));
    console.log('====================================');
    // try {
    //     const user = req.user;

    //     const { name, description, price, stock, subCategoryId } = req.body;
    //     if (!name || !description || !price || !stock || !subCategoryId) {
    //         return res.status(400).json({ message: "Name, description, price, stock and subCategoryId are required" });
    //     }

    //     const subCategory = await SubCategory.findById(subCategoryId);
    //     if (!subCategory) {
    //         return res.status(404).json({ message: "Sub category not found" });
    //     }

    //     if (!req.files) {
    //         return res.status(400).json({ message: "Image is required" });
    //     }

    //     // Log thông tin file ảnh để debug
    //     console.log('File information:', {
    //         originalname: req.file.originalname,
    //         mimetype: req.file.mimetype,
    //         size: req.file.size,
    //         path: req.file.path,
    //         filename: req.file.filename
    //     });

    //     // Kiểm tra và xử lý thông tin ảnh từ Cloudinary
    //     if (!req.files.path || !req.files.filename) {
    //         return res.status(400).json({ message: "Invalid image upload" });
    //     }

    //     // Tạo object image với thông tin từ Cloudinary
    //     const image = {
    //         url: req.files.path,
    //         public_id: req.files.filename
    //     };

    //     // Log thông tin image object để kiểm tra
    //     console.log('Image object:', image);

    //     const productData = {
    //         name,
    //         description,
    //         price: Number(price),
    //         stock: Number(stock),
    //         subCategory: subCategoryId,
    //         createdBy: user._id,
    //         image
    //     };

    //     // Log thông tin product trước khi tạo
    //     console.log('Product data:', productData);

    //     const product = await Product.create(productData);

    //     // Log thông tin product sau khi tạo
    //     console.log('Created product:', product);

    //     res.status(201).json({
    //         message: "Product created successfully !!!",
    //         product
    //     });
    // } catch (error) {
    //     console.error('Error creating product:', error);
    //     res.status(500).json({
    //         message: error.message || 'An error occurred while creating product',
    //         error: error.toString()
    //     });
    // }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to update product" });
        }
        const { id } = req.params;
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { name, description, price, subCategoryId } = req.body;

        const subCategory = await SubCategory.findById(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: "Sub category not found" });
        }

        if (!name || !description || !price || !stock || !subCategoryId) {
            return res.status(400).json({ message: "Name, description, price, stock and subCategoryId are required" });
        }

        let image = existingProduct.image;
        if (req.file) {
            if (existingProduct.image && existingProduct.image.public_id) {
                await cloudinary.uploader.destroy(existingProduct.image.public_id);
            }

            image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                subCategory: subCategoryId,
                image
            },
            { new: true }
        );

        res.status(200).json({
            message: "Product updated successfully !!!",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to delete product" });
        }
        const { id } = req.params;
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully !!!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.activeProduct = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to change product status" });
        }

        const { id } = req.params;
        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Lấy giá trị stock hiện tại
        const currentStock = existingProduct.stock;
        let newStock;

        // Logic flipbit cho stock
        if (currentStock > 0) {
            // Nếu đang kinh doanh và còn hàng -> chuyển sang ngừng kinh doanh (giữ nguyên số lượng)
            newStock = currentStock;
        } else if (currentStock === 0) {
            // Nếu hết hàng -> chuyển sang ngừng kinh doanh
            newStock = 0;
        } else if (currentStock <= -9999) {
            // Nếu đang ngừng kinh doanh và het hàng -> chuyển sang ngung kinh doanh
            newStock = 0;
        } else {
            // Nếu đang ngừng kinh doanh -> chuyển sang kinh doanh lại với số lượng hiện có
            newStock = Math.abs(currentStock);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { stock: newStock },
            { new: true }
        );

        // Tạo message tương ứng với trạng thái mới
        let message;
        if (newStock > 0) {
            message = `Product is now in stock (${newStock} items) and available for sale`;
        } else if (newStock < 0) {
            message = `Product is temporarily out of stock (${Math.abs(newStock)} items) and not available for sale`;
        } else {
            message = `Product is out of stock but still available for sale`;
        }

        res.status(200).json({
            message,
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateStock = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to update product stock" });
        }

        const { id } = req.params;
        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Lấy giá trị stock hiện tại
        const currentStock = existingProduct.stock;
        let newStock;

        // Logic flipbit cho stock
        if (currentStock >= 0) {
            // Nếu stock >= 0 (đang kinh doanh) -> chuyển sang ngừng kinh doanh nhưng vẫn giữ số lượng
            newStock = -Math.abs(currentStock);
        } else {
            // Nếu stock < 0 (ngừng kinh doanh) -> chuyển sang kinh doanh lại với số lượng đã có
            newStock = Math.abs(currentStock);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { stock: newStock },
            { new: true }
        );

        // Tạo message tương ứng với trạng thái mới
        let message;
        if (newStock > 0) {
            message = `Product is now in stock (${newStock} items) and available for sale`;
        } else if (newStock < 0) {
            message = `Product is temporarily out of stock (${Math.abs(newStock)} items) and not available for sale`;
        } else {
            message = `Product is out of stock but still available for sale`;
        }

        res.status(200).json({
            message,
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

