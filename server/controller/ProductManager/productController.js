const BaseProduct = require("../../models/product/productBase");
const ProductVariant = require("../../models/product/ProductVariant");
const { SubCategory } = require("../../models/product/subCategory");
const { cloudinary } = require("../../middleware/upload.middleware")
const mongoose = require("mongoose");
const slugify = require('slugify');
const xlsx = require("xlsx");
const ExcelJS = require("exceljs");

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

module.exports.getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        let product = await BaseProduct.findOne({ slug });

        if (!product) {
            product = await BaseProduct.findOne({ name: slug });
            
            if (product) {
                product.slug = slugify(product.name, {
                    lower: true,
                    strict: true,
                    locale: 'vi'
                });
                await product.save();
            }
        }
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const variants = await ProductVariant.find({ baseProduct: product._id });
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

module.exports.createProduct = async (req, res) => {
  try {
    const user = req.user;
    const { name, description, price, stock, subCategoryId, origin, weight, expiryDate } = req.body;


if (!name || !description || !price || !stock || !subCategoryId || !origin || !weight || !expiryDate) {
  return res.status(400).json({
    message: "All fields are required: name, description, price, stock, subCategoryId, origin, weight, expiryDate",
  });
}


    const existingProduct = await BaseProduct.findOne({ name });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    // Kiểm tra danh mục con
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub category not found" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploadedFiles = Array.isArray(req.files.image)
      ? req.files.image
      : [req.files.image];

    if (uploadedFiles.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }

    const images = uploadedFiles.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    // Tạo slug duy nhất
    let slug = slugify(name, { lower: true, strict: true });
    let uniqueSlug = slug;
    let counter = 1;
    while (await BaseProduct.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const baseProduct = new BaseProduct({
      name,
      slug: uniqueSlug, 
      description,
      image: images[0],
      images,
      subCategory: subCategoryId,
      createdBy: user.id,
    });

    await baseProduct.save();

    // Tạo variant
    const productVariant = new ProductVariant({
      baseProduct: baseProduct._id,
      price,
      stock,
      weight,
      expiryDate, 
    });

    await productVariant.save();

    return res.status(201).json({
      message: "Product created successfully!",
      baseProduct,
      productVariant,
    });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports.updateProduct = async (req, res) => {
  try {
    console.log('Yêu cầu updateProduct:', { params: req.params, body: req.body });

    const { id } = req.params;
    const { name, description, subCategoryId, origin, weight, expiryDate, price, stock, status } = req.body || {};

    // Xác thực đầu vào
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    if (!name || !description || !subCategoryId || !origin || !weight || !expiryDate || !price || stock === undefined)
      return res.status(400).json({ success: false, message: 'Thiếu các trường bắt buộc: name, description, subCategoryId, origin, weight, expiryDate, price, stock' });
    if (isNaN(weight) || weight <= 0)
      return res.status(400).json({ success: false, message: 'Trọng lượng phải là số dương' });
    if (isNaN(price) || price <= 0)
      return res.status(400).json({ success: false, message: 'Giá phải là số dương' });
    if (isNaN(Date.parse(expiryDate)))
      return res.status(400).json({ success: false, message: 'Ngày hết hạn không hợp lệ' });
    if (isNaN(stock) || stock < -9999)
      return res.status(400).json({ success: false, message: 'Số lượng tồn kho không hợp lệ' });

    // Tìm sản phẩm và danh mục con
    const [existingProduct, subCategory] = await Promise.all([
      BaseProduct.findById(id),
      SubCategory.findById(subCategoryId),
    ]);
    if (!existingProduct)
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    if (!subCategory)
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục con' });

    // Xử lý ảnh
    let images = existingProduct.images || [];
    let image = existingProduct.image;
    if (req.files?.image) {
      const uploadedFiles = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
      if (uploadedFiles.length > 3)
        return res.status(400).json({ success: false, message: 'Tối đa 3 ảnh được phép' });

      // Xóa ảnh cũ trên Cloudinary
      if (images.length) {
        await Promise.all(images.map(img => img.public_id && cloudinary.uploader.destroy(img.public_id)));
      }

      // Upload ảnh mới
      images = uploadedFiles.map(file => ({ url: file.path, public_id: file.filename }));
      image = images[0] || image;
    }

    // Cập nhật slug nếu tên thay đổi
    const slug = existingProduct.name !== name ? slugify(name, { lower: true, strict: true, locale: 'vi' }) : existingProduct.slug;

    // Cập nhật base product
    const updatedBaseProduct = await BaseProduct.findByIdAndUpdate(
      id,
      { name, slug, description, origin, subCategory: subCategoryId, image, images },
      { new: true }
    ).lean();

    // Cập nhật biến thể với logic stock
    const variants = await ProductVariant.find({ baseProduct: id }).lean();
    if (!variants.length)
      return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể' });

    await ProductVariant.bulkWrite(variants.map(variant => {
      let newStock = stock;
      if (status) {
        if (status === 'inactive') {
          newStock = stock > 0 ? -stock : stock === 0 ? -9999 : stock;
        } else if (status === 'active') {
          newStock = stock === -9999 ? 0 : stock < 0 ? Math.abs(stock) : stock;
        }
      }
      return {
        updateOne: {
          filter: { _id: variant._id },
          update: { weight, expiryDate, price, stock: newStock },
        },
      };
    }));

    const updatedVariants = await ProductVariant.find({ baseProduct: id }).lean();
    const stockValue = updatedVariants[0].stock;
    const message = status === 'active' || stockValue >= 0
      ? stockValue > 0
        ? `Sản phẩm đang bán với ${stockValue} mặt hàng`
        : 'Sản phẩm đang bán nhưng hết hàng'
      : stockValue === -9999
        ? 'Sản phẩm không bán và hết hàng'
        : `Sản phẩm không bán với ${Math.abs(stockValue)} mặt hàng`;

    return res.status(200).json({
      success: true,
      message,
      data: { product: updatedBaseProduct, variants: updatedVariants },
    });
  } catch (error) {
    console.error('Lỗi trong updateProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message,
    });
  }
};



module.exports.activeProduct = async (req, res) => {
  try {
    console.log("Yêu cầu nhận được:", { params: req.params, body: req.body });

    const { id } = req.params;
    const { status } = req.body || {};

    // Xác thực đầu vào
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "ID sản phẩm không hợp lệ" });
    if (!status || !["active", "inactive"].includes(status))
      return res
        .status(400)
        .json({
          success: false,
          message: 'Trạng thái phải là "active" hoặc "inactive"',
        });

    // Lấy sản phẩm và biến thể
    const [baseProduct, variants] = await Promise.all([
      BaseProduct.findById(id).lean(),
      ProductVariant.find({ baseProduct: id }).lean(),
    ]);

    if (!baseProduct)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    if (!variants.length)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy biến thể" });

    // Cập nhật stock hàng loạt
    await ProductVariant.bulkWrite(
      variants.map((variant) => ({
        updateOne: {
          filter: { _id: variant._id },
          update: {
            stock:
              status === "inactive"
                ? variant.stock > 0
                  ? -(variant.stock + 1)
                  : variant.stock === 0
                  ? -9999
                  : variant.stock
                : variant.stock === -9999
                ? 0
                : variant.stock < 0
                ? Math.abs(variant.stock) - 1
                : variant.stock,
          },
        },
      }))
    );

    // Lấy biến thể đã cập nhật
    const updatedVariants = await ProductVariant.find({
      baseProduct: id,
    }).lean();
    const stock = updatedVariants[0].stock;
    const message =
      status === "active"
        ? stock > 0
          ? `Sản phẩm đang bán với ${stock} mặt hàng`
          : "Sản phẩm đang bán nhưng hết hàng"
        : stock === -9999
        ? "Sản phẩm không bán và hết hàng"
        : `Sản phẩm không bán với ${Math.abs(stock)} mặt hàng`;

    return res.status(200).json({
      success: true,
      message,
      data: { product: baseProduct, variants: updatedVariants },
    });
  } catch (error) {
    console.error("Lỗi trong activeProduct:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};


module.exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStock, newPrice } = req.body;

        if (!newStock || !newPrice) {
            return res.status(400).json({
                message: "newStock and newPrice are required"
            });
        }

        const existingVariants = await ProductVariant.find({ baseProduct: id }).populate('baseProduct');
        
        if (!existingVariants || existingVariants.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingVariantWithSamePrice = existingVariants.find(variant => 
            Number(variant.price) === Number(newPrice)
        );

        if (existingVariantWithSamePrice) {
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
            const newVariant = new ProductVariant({
                baseProduct: id,
                price: newPrice,
                stock: newStock
            });

            await newVariant.save();

            const allVariants = await ProductVariant.find({ baseProduct: id }).populate('baseProduct');
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
        const baseProduct = await BaseProduct.findById(id);
        const variants = await ProductVariant.find({ baseProduct: id });

        if (!baseProduct || !variants || variants.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const oldVariants = variants.map(v => ({
            price: v.price,
            stock: v.stock,
            totalValue: v.price * v.stock
        }));

        const totalStock = variants.reduce((sum, variant) => sum + Math.abs(variant.stock), 0);
        const totalValue = variants.reduce((sum, variant) => sum + (variant.price * Math.abs(variant.stock)), 0);
        const newPrice = Math.round(totalValue / totalStock);

        await ProductVariant.deleteMany({ baseProduct: id });

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

module.exports.updateAllProductSlugs = async (req, res) => {
    try {
        const products = await BaseProduct.find();
        let updatedCount = 0;

        for (const product of products) {
            if (!product.slug) {
                product.slug = slugify(product.name, {
                    lower: true,
                    strict: true,
                    locale: 'vi'
                });
                await product.save();
                updatedCount++;
            }
        }

        res.status(200).json({
            message: `Successfully updated slugs for ${updatedCount} products`,
            totalProducts: products.length,
            updatedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProduct = await BaseProduct.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        await ProductVariant.deleteMany({ baseProduct: id });
        await BaseProduct.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully !!!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.importProductsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let imported = 0;
    for (const row of rows) {
      const { name, description, subCategoryName, price, stock, imageUrl, origin, weight, expiryDate } =
        row;

      if (
        !name ||
        !description ||
        !subCategoryName ||
        !price ||
        !stock ||
        !imageUrl ||
        !origin ||
        !weight ||
        !expiryDate
      ) {
        console.log("⚠️ Thiếu dữ liệu dòng:", row);
        continue;
      }

      const subCategory = await SubCategory.findOne({ name: subCategoryName });
      if (!subCategory) {
        console.log(`❌ Không tìm thấy subCategory: ${subCategoryName}`);
        continue;
      }

      let slug = slugify(name, { lower: true, strict: true });
      let uniqueSlug = slug;
      let count = 1;
      while (await BaseProduct.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${count++}`;
      }

      const baseProduct = await BaseProduct.create({
        name,
        slug: uniqueSlug,
        description,
        origin,
        image: {
          url: imageUrl,
          public_id: "",
        },
        subCategory: subCategory._id,
        createdBy: req.user?.id || null, // nếu có login
      });

      await ProductVariant.create({
        baseProduct: baseProduct._id,
        price,
        stock,
        weight, 
        expiryDate, 
      });

      imported++;
    }

    return res
      .status(200)
      .json({ message: `Đã import ${imported} sản phẩm thành công` });
  } catch (error) {
    console.error("❌ Lỗi import:", error);
    return res.status(500).json({ message: error.message });
  }
};


exports.exportProductsToExcel = async (req, res) => {
  try {
    const products = await BaseProduct.find().populate("subCategory");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      { header: "Tên sản phẩm", key: "name", width: 30 },
      { header: "Mô tả", key: "description", width: 40 },
      { header: "Giá", key: "price", width: 15 },
      { header: "Tồn kho", key: "stock", width: 15 },
      { header: "Danh mục con", key: "subCategory", width: 25 },
      { header: "Xuất xứ", key: "origin", width: 20 }, 
      { header: "Trọng lượng", key: "weight", width: 15 }, 
      { header: "Hạn sử dụng", key: "expiryDate", width: 20 }, 
    ];

    for (const product of products) {
      const variant = await ProductVariant.findOne({
        baseProduct: product._id,
      });
      worksheet.addRow({
        name: product.name,
        description: product.description,
        price: variant?.price || "",
        stock: variant?.stock || "",
        subCategory: product.subCategory?.name || "",
        origin: product.origin || "", 
        weight: variant?.weight || "",
        expiryDate: variant?.expiryDate || "", 
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=productsList.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Export failed" });
  }
};


