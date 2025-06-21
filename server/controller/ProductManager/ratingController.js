const Rating = require("../../models/product/rating");
const ProductVariant = require("../../models/product/ProductVariant");

// Thêm đánh giá mới
exports.createRating = async (req, res) => {
  try {
    const { productVariant, stars, comment, images } = req.body;
    const userId = req.user._id; // middleware auth

    const rating = new Rating({
      productVariant,
      user: userId,
      stars,
      comment,
      images,
    });

    await rating.save();
    res.status(201).json({ message: "Rating created successfully", rating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRatingsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.find({ productVariant: productId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
