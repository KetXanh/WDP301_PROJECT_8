
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
        const email = req.user.email;
        const { productId, quantity, price } = req.body;

        const user = await Users.findOne({ email }).select("_id");
        if (!user) {
            return res.status(404).json({ code: 404, message: "User not found" });
        }


        let cart = await Carts.findOne({ user: user._id });
        if (!cart) {
            cart = new Carts({
                user: user._id,
                items: [],
                totalQuantity: 0,
                totalPrice: 0
            });
        }

        if (!productId || !quantity || !price) {
            return res.status(400).json({ code: 400, message: "Product ID, quantity, and price are required" });
        }

        const qty = Number(quantity);
        if (isNaN(qty) || qty < 1) {
            return res.status(400).json({ code: 400, message: "Invalid quantity" });
        }

        const existingItem = cart.items.find(item => item.product === productId);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            cart.items.push({
                product: productId,
                quantity: qty,
                price: Number(price)
            });
        }

        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({ code: 200, message: "Item added to cart successfully", data: cart });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server Error", error: error.message });
    }
};

module.exports.increaseItemQuantity = async (req, res) => {
    try {
        const email = req.user.email;
        const { productId } = req.params;

        const user = await Users.findOne({ email }).select("_id");
        const cart = await Carts.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ code: 404, message: "Cart not found" });

        const item = cart.items.find(i => i.product.equals(productId));
        if (!item) return res.status(404).json({ code: 404, message: "Item not found in cart" });

        item.quantity += 1;

        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({ code: 200, message: "Quantity increased", data: cart });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server Error", error: error.message });
    }
};

module.exports.decreaseItemQuantity = async (req, res) => {
    try {
        const email = req.user.email;
        const { productId } = req.params;

        const user = await Users.findOne({ email }).select("_id");
        const cart = await Carts.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ code: 404, message: "Cart not found" });

        const item = cart.items.find(i => i.product.equals(productId));
        if (!item) return res.status(404).json({ code: 404, message: "Item not found in cart" });

        item.quantity -= 1;

        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => !i.product.equals(productId));
        }

        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({ code: 200, message: "Quantity decreased", data: cart });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server Error", error: error.message });
    }
};

module.exports.removeItemFromCart = async (req, res) => {
    try {
        const email = req.user.email;
        const { productId } = req.params;

        const user = await Users.findOne({ email }).select("_id");
        const cart = await Carts.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ code: 404, message: "Cart not found" });

        const itemExists = cart.items.find(i => i.product.equals(productId));
        if (!itemExists) return res.status(404).json({ code: 404, message: "Item not found in cart" });

        cart.items = cart.items.filter(i => !i.product.equals(productId));

        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({ code: 200, message: "Item removed", data: cart });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server Error", error: error.message });
    }
};