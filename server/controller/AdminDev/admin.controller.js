const User = require("../../models/user");

module.exports.getAllUser = async (req, res) => {
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
       
        const admin = await User.findByIdAndUpdate(id, { role }, { new: true });
        res.status(200).json({
            message: "Sale manager role changed successfully",
            admin
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}