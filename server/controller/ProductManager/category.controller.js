const { Category } = require("../../models/product/category");
const { SubCategory } = require("../../models/product/subCategory");
const { User } = require("../../models/user");


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


module.exports.createCategory = async (req, res) => {
    try {
        const user = req.user;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
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
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to update category" });
        }
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }
        const category = await Category.findByIdAndUpdate(id, { name, description, createdBy: user.id }, { new: true });
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
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to delete category" });
        }
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

module.exports.activeCategory = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to active category" });
        }

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
        console.error('Error in activeCategory:', error);
        res.status(500).json({ 
            message: error.message || 'An error occurred while updating category status',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
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
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to create sub category" });
        }
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
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to update sub category" });
        }
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
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to delete sub category" });
        }
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
        const user = req.user;
        if (user.role !== 3) {
            return res.status(403).json({ message: "You are not authorized to active sub category" });
        }
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
        console.error('Error in activeSubCategory:', error);
        res.status(500).json({ 
            message: error.message || 'An error occurred while updating subcategory status',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}