const { Category } = require("../../models/product/category");
const { SubCategory } = require("../../models/product/subCategory");
const ProductBase = require("../../models/product/productBase");
const { User } = require("../../models/user");
const slugify = require('slugify');


module.exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            message: "Categories fetched successfully !!!",
            categories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        let category = await Category.findOne({ slug });

        if (!category) {
            category = await Category.findOne({ name: slug });
            
            if (category) {
                category.slug = slugify(category.name, {
                    lower: true,
                    strict: true,
                    locale: 'vi'
                });
                await category.save();
            }
        }
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const populatedCategory = await Category.findById(category._id);

        res.status(200).json({
            message: "Category fetched successfully !!!",
            category: populatedCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getSubCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        let subCategory = await SubCategory.findOne({ slug });

        if (!subCategory) {
            subCategory = await SubCategory.findOne({ name: slug });
            
            if (subCategory) {
                subCategory.slug = slugify(subCategory.name, {
                    lower: true,
                    strict: true,
                    locale: 'vi'
                });
                await subCategory.save();
            }
        }
        
        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        const populatedSubCategory = await SubCategory.findById(subCategory._id).populate({
            path: 'category',
            model: 'Categories'
        });

        res.status(200).json({
            message: "SubCategory fetched successfully !!!",
            subCategory: populatedSubCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.createCategory = async (req, res) => {
    try {
        const user = req.user;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const category = await Category.create({ name, description, createdBy: user.id });
        res.status(201).json({
            message: "Category created successfully !!!",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }

        const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
        if (existingCategory) {
            return res.status(400).json({ message: "Another category with this name already exists" });
        }

        const category = await Category.findByIdAndUpdate(
            id, 
            { name, description, createdBy: user.id }, 
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "Category updated successfully !!!",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        res.status(200).json({
            message: "Category deleted successfully !!!",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getCategoryAndSubCategoryStats = async (req, res) => {
  try {
    const categoryCount = await Category.countDocuments();
    const subcategoryCount = await SubCategory.countDocuments();

    return res.status(200).json({
      categoryCount,
      subcategoryCount,
    });
  } catch (error) {
    console.error("Error getting category stats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.activeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        const newStatus = !existingCategory.status;
        const category = await Category.findByIdAndUpdate(id, { status: newStatus }, { new: true });

        res.status(200).json({
            message: `Category ${category.status ? 'activated' : 'deactivated'} successfully !!!`,
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.status(200).json({
            message: "Sub categories fetched successfully !!!",
            subCategories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.createSubCategory = async (req, res) => {
    try {
        const { name, description, categoryId } = req.body;
        if (!name || !description || !categoryId) {
            return res.status(400).json({ message: "Name, description and categoryId are required" });
        }
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const subCategory = await SubCategory.create({ name, description, category: categoryId, createdBy: user.id });
        res.status(201).json({
            message: "Subcategory created successfully !!!",
            subCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, categoryId } = req.body;
        if (!name || !description || !categoryId) {
            return res.status(400).json({ message: "Name, description and categoryId are required" });
        }
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const subCategory = await SubCategory.findByIdAndUpdate(id, { name, description, category: categoryId, createdBy: user.id }, { new: true });
        res.status(200).json({
            message: "Sub category updated successfully !!!",
            subCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findByIdAndDelete(id);
        res.status(200).json({
            message: "Sub category deleted successfully !!!",
            subCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.activeSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const existingSubCategory = await SubCategory.findById(id);
        if (!existingSubCategory) {
            return res.status(404).json({ message: "Sub category not found" });
        }
        const newStatus = !existingSubCategory.status;
        const subCategory = await SubCategory.findByIdAndUpdate(id, { status: newStatus }, { new: true });
        
        res.status(200).json({
            message: `Sub category ${subCategory.status ? 'activated' : 'deactivated'} successfully !!!`,
            subCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getProductCountByCategory = async (req, res) => {
  try {
    const result = await ProductBase.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      { $unwind: "$subCategory" },
      {
        $lookup: {
          from: "categories",
          localField: "subCategory.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          total: 1,
          _id: 0,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error in getProductCountByCategory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
