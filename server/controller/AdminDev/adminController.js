const User = require("../../models/user");
const Product = require("../../models/product/productBase");

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

        // Kiểm tra phân quyền: chỉ role >= 1 (admin dev) mới được đổi vai trò
        if (!user || user.role < 1) {
            return res.status(403).json({
                message: "Access denied. Only admin can change roles."
            });
        }

        // Kiểm tra role hợp lệ
        const validRoles = [0, 1, 2, 3, 4];
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