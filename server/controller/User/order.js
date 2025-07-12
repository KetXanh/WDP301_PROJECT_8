const { Orders } = require("../../models/product/order");
const productBase = require("../../models/product/productBase");
const ProductVariant = require("../../models/product/ProductVariant");
const Users = require("../../models/user");
const generateCOD = require('../../utils/generateCOD');
const removePurchasedFromCart = require("../../utils/removeProductInCart");

module.exports.userOrder = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await Users.findOne({
            email: email
        })
        if (!user) {
            return res.json({
                message: "Not Found User"
            })
        }
        if (!req.body.shippingAddress) {
            return res.json({
                code: 401,
                message: "Shipping address not empty"
            })
        }
        const itemsInput = req.body.items;
        const productIds = itemsInput.map(i => i.product);
        const variants = await ProductVariant
            .find({ _id: { $in: productIds } })
            .select("_id price")
            .lean();

        if (variants.length !== productIds.length) {
            const foundIds = variants.map(v => v._id.toString());
            const missing = productIds.filter(id => !foundIds.includes(id.toString()));
            return res.status(404).json({ message: `Variant(s) not found: ${missing.join(", ")}` });
        }

        let total = 0;
        let totalQuantity = 0;
        const items = itemsInput.map(it => {
            const variant = variants.find(v => v._id.equals(it.product));
            const linePrice = variant.price * it.quantity;

            total += linePrice;
            totalQuantity += it.quantity;
            return {
                product: variant._id,
                quantity: it.quantity,
                price: linePrice
            };
        });

        const cod = generateCOD();

        const order = await Orders.create({
            user: user._id,
            items,
            totalAmount: total,
            totalQuantity,
            shippingAddress: req.body.shippingAddress,
            COD: cod,
            payment: req.body.paymentMethod,
            note: req.body.note
        });
        if (req.body.paymentMethod === "CASH") {
            const purchasedIds = order.items.map(item => item.product);
            await removePurchasedFromCart(order.user, purchasedIds);
        }
        res.json({
            code: 201,
            message: "Order successfully",
            orderId: order._id,
            totalAmount: order.totalAmount
        })
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
            error: error.message
        });
    }
}

module.exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

        if (!orderId) {
            return res.json({
                code: 400,
                message: "Invalid order ID format"
            });
        }

        const order = await Orders.findById(orderId)
            .populate({
                path: "user",
                select: "email fullName"
            })
            .populate({
                path: "items.product",
                select: "name price"
            })
            .lean();

        if (!order) {
            return res.status(404).json({
                code: 404,
                message: "Order not found"
            });
        }

        res.json({
            code: 200,
            message: "Order retrieved successfully",
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message
        });
    }
};


module.exports.getOrderByUser = async (req, res) => {
    try {
        const username = req.user.username;
        const user = await Users.findOne({
            username: username
        })
        if (!user) {
            return res.json({
                code: 404,
                message: "Not found user"
            })
        }
        const order = await Orders.find({ user: user._id })
            .select("items totalAmount status payment note createdAt shippingAddress paymentStatus")
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "email fullName" })
            .populate({
                path: "items.product",
                select: "price baseProduct",
                populate: {
                    path: "baseProduct",
                    select: "name image"
                }
            })
            .lean();


        // {
        //     id: '4',
        //     orderNumber: 'ORD-2024-004',
        //     date: '2024-01-22',
        //     status: 'cancelled',
        //     total: 150000,
        //     items: [
        //         { id: '5', name: 'Mũ lưỡi trai', quantity: 1, price: 150000 }
        //     ],
        //     shippingAddress: '321 Võ Văn Tần, Quận 1, TP.HCM',
        //     paymentMethod: 'Thẻ tín dụng'
        // }

        const formatData = order.map(o => ({
            id: o._id,
            orderNumber: o._id,
            date: o.createdAt,
            status: o.status,
            total: o.totalAmount,
            items: o.items.map(i => ({
                id: i.product._id,
                name: i.product?.baseProduct?.name,
                price: i.product?.price,
                image: i.product?.baseProduct?.image?.url,
                quantity: i.quantity
            })),
            shippingAddress: `${o?.shippingAddress?.street}, ${o?.shippingAddress?.ward}, ${o?.shippingAddress?.district}, ${o?.shippingAddress?.province}`,
            paymentMethod: o.payment,
            note: o.note,
            paymentStatus: o.paymentStatus
        }))




        res.json({
            code: 200,
            message: "Order user successfully",
            data: formatData
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Server Error",
            error: error.message
        });
    }
}