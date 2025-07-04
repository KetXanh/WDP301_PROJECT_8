
const { Carts } = require("../../models/product/cart");
const Users = require("../../models/user");

module.exports.getCart = async (req, res) => {
    try {
        const email = req.user.email;
        const userId = await Users.findOne({ email }).select('_id');

        if (!userId) {
            return res.status(404).json({
                code: 404,
                message: "User not found",
            });
        }

        const cart = await Carts.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'price stock baseProduct',
                populate: {
                    path: 'baseProduct',
                    select: 'name image slug',
                },
            })
            .lean();

        if (!cart) {
            return res.status(404).json({
                code: 404,
                message: "Cart not found for this user",
            });
        }

        const enriched = cart.items.map((it) => ({
            productId: it.product._id,
            slug: it.product.baseProduct.slug,
            name: it.product.baseProduct.name,
            imageUrl: it.product.baseProduct.image.url,
            price: it.price,
            quantity: it.quantity,
            stock: it.product.stock,
            status: it.product.stock < 0 ? 'paused' : 'active',
        }));

        return res.status(200).json({
            code: 200,
            message: "Cart retrieved successfully",
            data: enriched,
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message,
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

module.exports.removeMultipleItemsFromCart = async (req, res) => {
    try {
        const email = req.user.email;
        const { productIds } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                code: 400,
                message: "Danh sách sản phẩm không hợp lệ"
            });
        }

        const user = await Users.findOne({ email }).select("_id");
        if (!user) {
            return res.status(404).json({ code: 404, message: "User not found" });
        }

        const cart = await Carts.findOne({ user: user._id });
        if (!cart) {
            return res.status(404).json({ code: 404, message: "Cart not found" });
        }

        // Lọc bỏ những item không nằm trong danh sách cần xóa
        cart.items = cart.items.filter(
            (item) => !productIds.includes(item.product.toString())
        );

        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await cart.save();

        return res.status(200).json({
            code: 200,
            message: "Đã xoá các sản phẩm đã chọn",
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
};

module.exports.addAddress = async (req, res) => {
    try {
        const userId = req.user?.username;

        if (!userId) {
            return res.status(401).json({
                code: 401,
                message: "Không tìm thấy người dùng. Vui lòng đăng nhập.",
            });
        }

        const {
            fullName,
            phone,
            street,
            ward,
            district,
            province,
            label,
            isDefault = false
        } = req.body;

        if (!fullName || !phone || !street || !ward || !district || !province) {
            return res.status(400).json({
                code: 400,
                message: "Vui lòng cung cấp đầy đủ thông tin: fullName, phone, street, ward, district, province"
            });
        }

        const user = await Users.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "Không tìm thấy người dùng"
            });
        }

        const newAddress = {
            fullName,
            phone,
            street,
            ward,
            district,
            province,
            label,
            isDefault
        };

        if (isDefault) {
            user.address = user.address.map(addr => ({
                ...addr._doc,
                isDefault: false
            }));
        }

        user.address.push(newAddress);

        await user.save();

        return res.status(200).json({
            code: 200,
            message: "Thêm địa chỉ thành công",
            address: newAddress
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Lỗi máy chủ",
            error: error.message
        });
    }
}

module.exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user?.username;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(401).json({
                code: 401,
                message: "Không tìm thấy người dùng. Vui lòng đăng nhập.",
            });
        }

        if (!addressId) {
            return res.status(400).json({
                code: 400,
                message: "Vui lòng cung cấp addressId",
            });
        }

        const user = await Users.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "Không tìm thấy người dùng",
            });
        }

        const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({
                code: 404,
                message: "Không tìm thấy địa chỉ",
            });
        }

        const isDefaultAddress = user.address[addressIndex].isDefault;

        user.address.splice(addressIndex, 1);

        if (isDefaultAddress && user.address.length > 0) {
            user.address[0].isDefault = true;
        }

        await user.save();

        return res.status(200).json({
            code: 200,
            message: "Xóa địa chỉ thành công",
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
};
