const ProductBase = require("../../models/product/productBase");
const ProductVariant = require("../../models/product/ProductVariant");
const Rating = require("../../models/product/rating");
const Users = require("../../models/user");

exports.createRating = async (req, res) => {
    try {
        const { ProductBase: productBaseId, stars, comment, images } = req.body;
        const rawUser = req.user;

        const user = await Users.findOne({ email: rawUser.email });
        if (!user) {
            return res.json({ message: "User không tồn tại", code: 404 });
        }

        const product = await ProductBase.findById(productBaseId);
        if (!product) {
            return res.json({ message: "Không tìm thấy sản phẩm", code: 404 });
        }

        if (!stars || stars < 1 || stars > 5) {
            return res.json({ message: "Số sao phải từ 1 đến 5", code: 405 });
        }

        const existingRating = await Rating.findOne({
            productBase: productBaseId,
            user: user._id,
        });
        if (existingRating) {
            return res.json({ message: "Bạn đã đánh giá sản phẩm này", code: 400 });
        }

        const rating = new Rating({
            productBase: productBaseId,
            user: user._id,
            stars,
            comment,
            images,
        });

        await rating.save();

        // Cập nhật rating trung bình và số lượng
        const ratings = await Rating.find({ productBase: productBaseId });
        const avgStars =
            ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;

        await ProductVariant.findOneAndUpdate({ baseProduct: productBaseId }, {
            rating: avgStars,
            ratingCount: ratings.length,
        });

        res.status(201).json({ message: "Tạo đánh giá thành công", rating });
    } catch (err) {
        console.error("Lỗi createRating:", err);
        if (err.name === "ValidationError" || err.name === "CastError") {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }
        res.status(500).json({ message: "Lỗi server" });
    }
};
