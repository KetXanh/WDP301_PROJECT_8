const User = require("../../models/user");
const Product = require("../../models/product/productBase");
const { SubCategory } = require("../../models/product/subCategory");
const slugify = require('slugify');
const ExcelJS = require('exceljs');

module.exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({}, '-password -re_token');

        res.status(200).json({
            message: "All users fetched successfully",
            users
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('subCategory') 
            .populate('createdBy', 'username email');

        res.status(200).json({
            message: "All products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports.changeRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = req.user;

        // Kiểm tra role hợp lệ
        const validRoles = [0, 2, 3, 4];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role."
            });
        }
        // Kiểm tra user có tồn tại không
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        // Cập nhật role
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        res.status(200).json({
            message: "User role changed successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
    console.log(`User with ID ${id} role changed to ${role} by ${user.username}`);
    
};


module.exports.banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        // Chỉ admin dev (role >= 1) mới được ban user
        // if (!currentUser || currentUser.role < 1) {
        //     return res.status(403).json({
        //         message: "Access denied. Only admin can ban users."
        //     });
        // }
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        // Nếu user đã bị ban rồi
        if (targetUser.status === "inactive") {
            return res.status(400).json({
                message: "User is already banned."
            });
        }
        targetUser.status = "inactive";
        await targetUser.save();
        res.status(200).json({
            message: "Người dùng đã bị cấm thành công.",
            user: {
                _id: targetUser._id,
                username: targetUser.username,
                email: targetUser.email,
                status: targetUser.status
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
module.exports.unbanUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        // if (!currentUser || currentUser.role < 1) {
        //     return res.status(403).json({
        //         message: "Access denied. Only admin can unban users."
        //     });
        // }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        if (targetUser.status === "active") {
            return res.status(400).json({
                message: "User is already active."
            });
        }
        targetUser.status = "active";
        await targetUser.save();

        res.status(200).json({
            message: "Người dùng đã được gỡ lệnh cấm thành công.",
            user: {
                _id: targetUser._id,
                username: targetUser.username,
                email: targetUser.email,
                status: targetUser.status
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        // Only admin dev (role >= 1) can delete users
        if (!currentUser || currentUser.role < 1) {
            return res.status(403).json({
                message: "Access denied. Only admin can delete users."
            });
        }
        // Prevent a user from deleting themselves
        if (currentUser._id.toString() === id) {
            return res.status(403).json({
                message: "You cannot delete your own account."
            });
        }
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            message: "User deleted successfully.",
            user: {
                _id: deletedUser._id,
                username: deletedUser.username,
                email: deletedUser.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        // Only admin dev (role >= 1) can delete products
        if (!currentUser || currentUser.role < 1) {
            return res.status(403).json({
                message: "Access denied. Only admin can delete products."
            });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product deleted successfully.",
            product: {
                _id: deletedProduct._id,
                name: deletedProduct.name,
                createdBy: deletedProduct.createdBy
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, origin, subCategoryId } = req.body;
        const currentUser = req.user;

        // Only admin dev (role >= 1) can update products
        if (!currentUser || currentUser.role < 1) {
            return res.status(403).json({
                message: "Access denied. Only admin can update products."
            });
        }

        // Validate required fields
        if (!name || !description || !origin || !subCategoryId) {
            return res.status(400).json({
                message: "All fields are required: name, description, origin, subCategoryId"
            });
        }

        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        // Check if subcategory exists
        const subCategory = await SubCategory.findById(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({
                message: "Subcategory not found."
            });
        }

        // Generate new slug if name changed
        let slug = existingProduct.slug;
        if (existingProduct.name !== name) {
            slug = slugify(name, {
                lower: true,
                strict: true,
                locale: "vi",
            });
            
            // Check if slug already exists
            const existingSlug = await Product.findOne({ slug, _id: { $ne: id } });
            if (existingSlug) {
                let counter = 1;
                let uniqueSlug = slug;
                while (await Product.findOne({ slug: uniqueSlug, _id: { $ne: id } })) {
                    uniqueSlug = `${slug}-${counter}`;
                    counter++;
                }
                slug = uniqueSlug;
            }
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                slug,
                description,
                origin,
                subCategory: subCategoryId
            },
            { new: true }
        ).populate('subCategory').populate('createdBy', 'username email');

        res.status(200).json({
            message: "Product updated successfully.",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports.getUserStats = async (req, res) => {
    try {
        const currentUser = req.user;

        // Chỉ admin dev (role >= 1) mới được xem thống kê
        // if (!currentUser || currentUser.role < 1) {
        //     return res.status(403).json({
        //         message: "Access denied. Only admin can view user statistics."
        //     });
        // }

        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: "active" });
        const inactiveUsers = await User.countDocuments({ status: "inactive" });

        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const roleMap = {
            0: "User",
            1: "Admin Dev",
            2: "Sale Manager",
            3: "Product Manager",
            4: "Sale Staff"
        };

        const formattedUsersByRole = usersByRole.map(roleStat => ({
            role: roleMap[roleStat._id] || `Unknown Role (${roleStat._id})`,
            count: roleStat.count
        }));

        res.status(200).json({
            message: "User statistics fetched successfully",
            statistics: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                usersByRole: formattedUsersByRole
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports.exportUsersToExcel = async (req, res) => {
  try {
    const users = await User.find({}, '-password -re_token');
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "STT", key: "stt", width: 10 },
      { header: "Họ và tên", key: "fullName", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Vai trò", key: "role", width: 20 },
      { header: "Số điện thoại", key: "phone", width: 20 },
      { header: "Địa chỉ", key: "address", width: 50 },
      { header: "Trạng thái", key: "status", width: 15 },
      { header: "Ngày tạo", key: "createdAt", width: 20 },
    ];

    const roleMap = {
      0: "User",
      1: "Admin Dev", 
      2: "Sale Manager",
      3: "Product Manager",
      4: "Sale Staff"
    };

    users.forEach((user, index) => {
      const address = user.address && user.address.length > 0 ? user.address[0] : null;
      const fullAddress = address 
        ? `${address.street}, ${address.ward}, ${address.district}, ${address.province}`
        : "N/A";

      worksheet.addRow({
        stt: index + 1,
        fullName: address?.fullName || "N/A",
        email: user.email,
        role: roleMap[user.role] || "N/A",
        phone: address?.phone || "N/A",
        address: fullAddress,
        status: user.status === "active" ? "Hoạt động" : "Bị khóa",
        createdAt: user.createdAt ? user.createdAt.toLocaleDateString('vi-VN') : "N/A"
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=danh-sach-tai-khoan.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export users error:", error);
    res.status(500).json({ message: "Export failed" });
  }
};

module.exports.exportStatisticsToExcel = async (req, res) => {
  try {
    const User = require("../../models/user");
    const Blog = require("../../models/blog");
    
    // Lấy thống kê người dùng
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const inactiveUsers = await User.countDocuments({ status: "inactive" });

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const roleMap = {
      0: "User",
      1: "Admin Dev",
      2: "Sale Manager",
      3: "Product Manager",
      4: "Sale Staff"
    };

    const formattedUsersByRole = usersByRole.map(roleStat => ({
      role: roleMap[roleStat._id] || `Unknown Role (${roleStat._id})`,
      count: roleStat.count
    }));

    // Lấy thống kê blog
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalComments: { 
            $sum: { 
              $cond: [
                { $isArray: "$comments" },
                { $size: "$comments" },
                0
              ]
            } 
          }
        }
      }
    ]);

    const totalViews = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: { $ifNull: ["$views", 0] } }
        }
      }
    ]);

    // Blog theo tháng (6 tháng gần nhất)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const blogsByMonth = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Top tác giả
    const topAuthors = await Blog.aggregate([
      {
        $group: {
          _id: "$author",
          blogCount: { $sum: 1 },
          totalViews: { $sum: { $ifNull: ["$views", 0] } }
        }
      },
      {
        $sort: { blogCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "authorInfo"
        }
      },
      {
        $unwind: "$authorInfo"
      },
      {
        $project: {
          authorName: "$authorInfo.username",
          blogCount: 1,
          totalViews: 1
        }
      }
    ]);

    // Top blog có nhiều view
    const topViewedBlogs = await Blog.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views createdAt')
      .populate('author', 'username');

    const workbook = new ExcelJS.Workbook();

    // Sheet 1: Tổng quan thống kê
    const overviewSheet = workbook.addWorksheet("Tổng quan");
    overviewSheet.columns = [
      { header: "Chỉ số", key: "metric", width: 30 },
      { header: "Giá trị", key: "value", width: 20 },
    ];

    overviewSheet.addRow({ metric: "Tổng số người dùng", value: totalUsers });
    overviewSheet.addRow({ metric: "Người dùng đang hoạt động", value: activeUsers });
    overviewSheet.addRow({ metric: "Người dùng bị khóa", value: inactiveUsers });
    overviewSheet.addRow({ metric: "Tổng số blog", value: totalBlogs });
    overviewSheet.addRow({ metric: "Tổng lượt xem blog", value: totalViews[0]?.totalViews || 0 });
    overviewSheet.addRow({ metric: "Tổng bình luận", value: totalComments[0]?.totalComments || 0 });
    overviewSheet.addRow({ metric: "Lượt xem trung bình/blog", value: totalBlogs > 0 ? Math.round((totalViews[0]?.totalViews || 0) / totalBlogs) : 0 });
    overviewSheet.addRow({ metric: "Bình luận trung bình/blog", value: totalBlogs > 0 ? Math.round((totalComments[0]?.totalComments || 0) / totalBlogs) : 0 });

    // Sheet 2: Phân bố người dùng theo vai trò
    const userRoleSheet = workbook.addWorksheet("Phân bố người dùng");
    userRoleSheet.columns = [
      { header: "Vai trò", key: "role", width: 25 },
      { header: "Số lượng", key: "count", width: 15 },
    ];

    formattedUsersByRole.forEach(role => {
      userRoleSheet.addRow({ role: role.role, count: role.count });
    });

    // Sheet 3: Blog theo tháng
    const blogMonthSheet = workbook.addWorksheet("Blog theo tháng");
    blogMonthSheet.columns = [
      { header: "Tháng/Năm", key: "month", width: 20 },
      { header: "Số blog", key: "count", width: 15 },
    ];

    const monthNames = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    blogsByMonth.forEach(item => {
      const monthName = `${monthNames[item._id.month - 1]}/${item._id.year}`;
      blogMonthSheet.addRow({ month: monthName, count: item.count });
    });

    // Sheet 4: Top tác giả
    const topAuthorSheet = workbook.addWorksheet("Top tác giả");
    topAuthorSheet.columns = [
      { header: "Tên tác giả", key: "authorName", width: 25 },
      { header: "Số blog", key: "blogCount", width: 15 },
      { header: "Tổng lượt xem", key: "totalViews", width: 20 },
    ];

    topAuthors.forEach(author => {
      topAuthorSheet.addRow({
        authorName: author.authorName,
        blogCount: author.blogCount,
        totalViews: author.totalViews
      });
    });

    // Sheet 5: Top blog có nhiều lượt xem
    const topBlogSheet = workbook.addWorksheet("Top blog nhiều lượt xem");
    topBlogSheet.columns = [
      { header: "Tiêu đề blog", key: "title", width: 40 },
      { header: "Tác giả", key: "author", width: 25 },
      { header: "Lượt xem", key: "views", width: 15 },
      { header: "Ngày tạo", key: "createdAt", width: 20 },
    ];

    topViewedBlogs.forEach(blog => {
      topBlogSheet.addRow({
        title: blog.title,
        author: blog.author?.username || "N/A",
        views: blog.views || 0,
        createdAt: blog.createdAt ? blog.createdAt.toLocaleDateString('vi-VN') : "N/A"
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=thong-ke-tong-quan.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export statistics error:", error);
    res.status(500).json({ message: "Export failed" });
  }
};

module.exports.getBlogStats = async (req, res) => {
  try {
    const Blog = require("../../models/blog");
    
    // Tổng số blog
    const totalBlogs = await Blog.countDocuments();
    
    // Blog theo tháng (6 tháng gần nhất)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const blogsByMonth = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Top tác giả (người viết nhiều blog nhất)
    const topAuthors = await Blog.aggregate([
      {
        $group: {
          _id: "$author",
          blogCount: { $sum: 1 },
          totalViews: { $sum: { $ifNull: ["$views", 0] } }
        }
      },
      {
        $sort: { blogCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "authorInfo"
        }
      },
      {
        $unwind: "$authorInfo"
      },
      {
        $project: {
          authorName: "$authorInfo.username",
          blogCount: 1,
          totalViews: 1
        }
      }
    ]);

    // Thống kê comment - Fix: handle missing comments field
    const totalComments = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalComments: { 
            $sum: { 
              $cond: [
                { $isArray: "$comments" },
                { $size: "$comments" },
                0
              ]
            } 
          }
        }
      }
    ]);

    // Blog có nhiều view nhất
    const topViewedBlogs = await Blog.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views createdAt')
      .populate('author', 'username');

    // Blog có nhiều comment nhất - Fix: handle missing comments field
    const topCommentedBlogs = await Blog.aggregate([
      {
        $addFields: {
          commentCount: { 
            $cond: [
              { $isArray: "$comments" },
              { $size: "$comments" },
              0
            ]
          }
        }
      },
      {
        $sort: { commentCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          title: 1,
          commentCount: 1,
          createdAt: 1,
          author: 1
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo"
        }
      },
      {
        $unwind: "$authorInfo"
      },
      {
        $project: {
          title: 1,
          commentCount: 1,
          createdAt: 1,
          authorName: "$authorInfo.username"
        }
      }
    ]);

    // Tổng lượt xem - Fix: handle missing views field
    const totalViews = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: { $ifNull: ["$views", 0] } }
        }
      }
    ]);

    res.status(200).json({
      message: "Blog statistics fetched successfully",
      statistics: {
        totalBlogs,
        totalComments: totalComments[0]?.totalComments || 0,
        totalViews: totalViews[0]?.totalViews || 0,
        blogsByMonth,
        topAuthors,
        topViewedBlogs,
        topCommentedBlogs
      }
    });
  } catch (error) {
    console.error("Blog stats error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

module.exports.exportFeedbackToExcel = async (req, res) => {
  try {
    const Rating = require("../../models/product/rating");
    const User = require("../../models/user");
    const ProductBase = require("../../models/product/productBase");

    // Lấy tất cả đánh giá với thông tin user và product
    const ratings = await Rating.find()
      .populate('user', 'username')
      .populate('productBase', 'name')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách đánh giá");

    // Định nghĩa cột
    worksheet.columns = [
      { header: "STT", key: "stt", width: 10 },
      { header: "Người dùng", key: "username", width: 25 },
      { header: "Sản phẩm", key: "productName", width: 30 },
      { header: "Số sao", key: "stars", width: 15 },
      { header: "Bình luận", key: "comment", width: 50 },
      { header: "Ngày đánh giá", key: "createdAt", width: 20 },
      { header: "Thời gian", key: "time", width: 15 },
    ];

    // Thêm dữ liệu
    ratings.forEach((rating, index) => {
      const createdAt = new Date(rating.createdAt);
      worksheet.addRow({
        stt: index + 1,
        username: rating.user?.username || "Ẩn danh",
        productName: rating.productBase?.name || "N/A",
        stars: rating.stars,
        comment: rating.comment || "Không có bình luận",
        createdAt: createdAt.toLocaleDateString('vi-VN'),
        time: createdAt.toLocaleTimeString('vi-VN')
      });
    });

    // Tạo thống kê
    const totalRatings = ratings.length;
    const averageStars = totalRatings > 0 
      ? (ratings.reduce((sum, rating) => sum + rating.stars, 0) / totalRatings).toFixed(1)
      : 0;
    
    const starDistribution = {};
    for (let i = 1; i <= 5; i++) {
      starDistribution[i] = ratings.filter(r => r.stars === i).length;
    }

    // Thêm sheet thống kê
    const statsSheet = workbook.addWorksheet("Thống kê");
    statsSheet.columns = [
      { header: "Chỉ số", key: "metric", width: 30 },
      { header: "Giá trị", key: "value", width: 20 },
    ];

    statsSheet.addRow({ metric: "Tổng số đánh giá", value: totalRatings });
    statsSheet.addRow({ metric: "Đánh giá trung bình", value: averageStars });
    statsSheet.addRow({ metric: "", value: "" }); // Dòng trống
    statsSheet.addRow({ metric: "Phân bố theo sao:", value: "" });
    statsSheet.addRow({ metric: "1 sao", value: starDistribution[1] });
    statsSheet.addRow({ metric: "2 sao", value: starDistribution[2] });
    statsSheet.addRow({ metric: "3 sao", value: starDistribution[3] });
    statsSheet.addRow({ metric: "4 sao", value: starDistribution[4] });
    statsSheet.addRow({ metric: "5 sao", value: starDistribution[5] });

    // Thêm sheet top sản phẩm được đánh giá
    const productStats = {};
    ratings.forEach(rating => {
      const productName = rating.productBase?.name || "N/A";
      if (!productStats[productName]) {
        productStats[productName] = {
          count: 0,
          totalStars: 0,
          averageStars: 0
        };
      }
      productStats[productName].count++;
      productStats[productName].totalStars += rating.stars;
    });

    // Tính trung bình sao cho từng sản phẩm
    Object.keys(productStats).forEach(productName => {
      productStats[productName].averageStars = 
        (productStats[productName].totalStars / productStats[productName].count).toFixed(1);
    });

    // Sắp xếp theo số lượng đánh giá giảm dần
    const topProducts = Object.entries(productStats)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10);

    const productSheet = workbook.addWorksheet("Top sản phẩm");
    productSheet.columns = [
      { header: "STT", key: "stt", width: 10 },
      { header: "Tên sản phẩm", key: "productName", width: 40 },
      { header: "Số đánh giá", key: "count", width: 15 },
      { header: "Trung bình sao", key: "averageStars", width: 20 },
    ];

    topProducts.forEach(([productName, stats], index) => {
      productSheet.addRow({
        stt: index + 1,
        productName: productName,
        count: stats.count,
        averageStars: stats.averageStars
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=danh-sach-danh-gia.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export feedback error:", error);
    res.status(500).json({ message: "Export failed" });
  }
};