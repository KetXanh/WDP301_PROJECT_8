const User = require("../../models/user");

module.exports.getAllSaleManager = async (req, res) => {
    try {
        const saleManager = await User.find({ role: 2 });
        res.json({ code: 200, message: "Lấy danh sách quản lý bán hàng thành công", data: saleManager });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
}

module.exports.changeRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!id || role === undefined || role === null) {
            return res.json({ code: 400, message: "ID và vai trò là bắt buộc" });
        }
        
        const user = await User.findById(id);
        if (!user) {
            return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        
        const currentUserRole = Number(req.user.role);
        const targetUserRole = Number(user.role);
        const newRoleNumber = Number(role);
        
        if (targetUserRole === 1) {
            return res.json({ code: 403, message: "Không thể thay đổi vai trò của Admin Dev" });
        }
        
        if (targetUserRole === 3) {
            return res.json({ code: 403, message: "Không thể thay đổi vai trò của Product Manager" });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role: Number(role) },
            { new: true }
        );
        if (!updatedUser) {
            return res.json({ code: 404, message: "Không tìm thấy người dùng" });
        }
        res.json({ code: 200, message: "Cập nhật vai trò người dùng thành công", data: updatedUser });
    } catch (error) {
        console.error('Error in changeRole:', error);
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const userLogin = req.user;
        const user = await User.findOne({ email: userLogin.email });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.status(200).json({ message: 'Lấy thông tin profile thành công', profile: user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        const query = {};
        if (role) {
            query.role = Number(role);
        }
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        res.json({
            code: 200,
            message: "Lấy danh sách người dùng thành công",
            users,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: Number(limit)
            }
        });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};

module.exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        
        // Thống kê theo role
        const roleStats = await User.aggregate([
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

        // Chuyển đổi thành object
        const roleDistribution = {
            0: 0, // Khách hàng
            1: 0, // Admin Dev
            2: 0, // Sale Manager
            3: 0, // Product Manager
            4: 0, // Sale Staff
        };

        roleStats.forEach(stat => {
            roleDistribution[stat._id] = stat.count;
        });

        res.json({
            code: 200,
            message: "Lấy thống kê người dùng thành công",
            data: {
                totalUsers,
                roleDistribution
            }
        });
    } catch (error) {
        res.json({ code: 500, message: "Lỗi máy chủ", error: error.message });
    }
};
