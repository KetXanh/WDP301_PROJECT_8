const { Orders } = require("../../models/product/order");
const productBase = require("../../models/product/productBase");
const ProductVariant = require("../../models/product/ProductVariant");
const Users = require("../../models/user");
const generateCOD = require('../../utils/generateCOD')

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
            COD: cod
        });
        res.json({
            code: 201,
            message: "Order successfully",
            order
        })
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
            error: error.message
        });
    }
}