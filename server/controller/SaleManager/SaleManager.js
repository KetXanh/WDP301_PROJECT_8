const User = require("../../models/user");

module.exports.getAllSaleManager = async (req, res) => {
    try {
        const saleManager = await User.find({ role: 2 });
        res.status(200).json({
            message: "Sale manager fetched successfully",
            saleManager
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

module.exports.changeRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = req.user;
        if (user.role !== 2) {
            return res.status(403).json({
                message: "You are not authorized to change role"
            })
        }
        if (!id || !role) {
            return res.status(400).json({
                message: "Id and role are required"
            })
        }
        const saleManager = await User.findByIdAndUpdate(id, { role }, { new: true });
        res.status(200).json({
            message: "Sale manager role changed successfully",
            saleManager
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}
