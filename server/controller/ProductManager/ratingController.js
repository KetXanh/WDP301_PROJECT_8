const mongoose = require("mongoose");
const Rating = require("../../models/product/rating");
const ProductVariant = require("../../models/product/ProductVariant");


exports.createRating = async (req, res) => {
  try {
    const { productVariant, stars, comment, images } = req.body;
    const userId = req.user._id;

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
    const { stars } = req.query;

    const filter = { productVariant: productId };
    if (stars) filter.stars = Number(stars);

    const ratings = await Rating.find(filter)
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;

    const deleted = await Rating.findByIdAndDelete(ratingId);
    if (!deleted) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json({ message: "Rating deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRatingStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const stats = await Rating.aggregate([
      {
        $match: {
          productVariant: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $group: {
          _id: "$productVariant",
          averageStars: { $avg: "$stars" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (!stats.length) {
      return res.json({ averageStars: 0, totalRatings: 0 });
    }

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
