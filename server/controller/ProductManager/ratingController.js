const mongoose = require("mongoose");
const Rating = require("../../models/product/rating");
const ProductBase = require("../../models/product/productBase");
const User = require("../../models/user");

// ✅ Tạo đánh giá
exports.createRating = async (req, res) => {
  try {
    const { ProductBase: productBaseId, stars, comment, images } = req.body;
    const rawUser = req.user;

    const user = await User.findOne({ email: rawUser.email });
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    const product = await ProductBase.findById(productBaseId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Số sao phải từ 1 đến 5" });
    }

    const existingRating = await Rating.findOne({
      productBase: productBaseId,
      user: user._id,
    });
    if (existingRating) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này" });
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

    await ProductBase.findByIdAndUpdate(productBaseId, {
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

// ✅ Lấy danh sách đánh giá theo ProductBase ID
exports.getRatingsByBaseProduct = async (req, res) => {
  try {
    const { baseProductId } = req.params;
    const { stars, page = 1, limit = 10 } = req.query;

    const filter = { productBase: baseProductId };
    if (stars && stars >= 1 && stars <= 5) {
      filter.stars = Number(stars);
    }
    console.log(filter);
    const ratings = await Rating.find(filter)
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Rating.countDocuments(filter);

    res.json({ ratings, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error("Error getRatingsByBaseProduct:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Lấy toàn bộ đánh giá (admin)
exports.getAllRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10, stars } = req.query;

    const filter = {};
    if (stars && stars >= 1 && stars <= 5) {
      filter.stars = Number(stars);
    }

    const ratings = await Rating.find(filter)
      .populate("user", "username avatar")
      .populate("productBase", "name image")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Rating.countDocuments(filter);

    res.json({ ratings, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Xoá đánh giá
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    const isOwner = rating.user.toString() === userId.toString();
    const isAdmin = req.user.role === 1;

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Không có quyền xóa đánh giá này" });
    }

    await Rating.findByIdAndDelete(ratingId);

    // Cập nhật lại rating trung bình và số lượng
    const ratings = await Rating.find({ productBase: rating.productBase });
    const avgStars =
      ratings.reduce((sum, r) => sum + r.stars, 0) / (ratings.length || 1);

    await ProductBase.findByIdAndUpdate(rating.productBase, {
      rating: avgStars,
      ratingCount: ratings.length,
    });

    res.json({ message: "Xóa đánh giá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Lấy thống kê đánh giá
exports.getRatingStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const stats = await Rating.aggregate([
      { $match: { productBase: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productBase",
          averageStars: { $avg: "$stars" },
          totalRatings: { $sum: 1 },
          starsList: { $push: "$stars" },
        },
      },
      {
        $project: {
          averageStars: 1,
          totalRatings: 1,
          starDistribution: {
            $arrayToObject: {
              $map: {
                input: [1, 2, 3, 4, 5],
                as: "star",
                in: {
                  k: { $toString: "$$star" },
                  v: {
                    $size: {
                      $filter: {
                        input: "$starsList",
                        as: "s",
                        cond: { $eq: ["$$s", "$$star"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    if (!stats.length) {
      return res.json({
        averageStars: 0,
        totalRatings: 0,
        starDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
