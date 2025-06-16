
const e = require("express");
const { Carts } = require("../../models/product/cart");
const Users = require("../../models/user");

module.exports.getCart = async (req, res) => {
    try {
        const email = req.user.email;
        const userId = await Users.findOne({
            email: email
        }).select('_id');

        if (!userId) {
            return res.status(404).json({
                code: 404,
                message: "User not found"
            });
        }

        const cart = await Carts.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                code: 404,
                message: "Cart not found for this user"
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Cart retrieved successfully",
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports.addItemToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity, price } = req.body;

        // Kiểm tra userId
        if (!userId) {
            return res.status(400).json({
                code: 400,
                message: "User ID is required"
            });
        }

        // Kiểm tra người dùng tồn tại
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "User not found"
            });
        }

        // Kiểm tra giỏ hàng tồn tại
        let cart = await Carts.findOne({ userId });
        if (!cart) {
            cart = new Carts({
                userId,
                items: [],
                totalQuantity: 0,
                totalPrice: 0
            });
        }

        // Kiểm tra đầu vào sản phẩm
        if (!productId || !quantity || !price) {
            return res.status(400).json({
                code: 400,
                message: "Product ID, quantity, and price are required"
            });
        }

        // Kiểm tra số lượng hợp lệ
        const qty = Number(quantity);
        if (isNaN(qty) || qty < 1) {
            return res.status(400).json({
                code: 400,
                message: "Invalid quantity"
            });
        }

        // Tìm sản phẩm trong giỏ hàng
        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += qty; // Bỏ kiểm tra stock
        } else {
            cart.items.push({
                productId,
                quantity: qty,
                price: Number(price)
            });
        }

        // Tính lại tổng
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // Lưu giỏ hàng
        await cart.save();

        return res.status(200).json({
            code: 200,
            message: "Item added to cart successfully",
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message
        });
    }
};