const express = require("express");
const router = express.Router();
const Authozation = require("../../middleware/auth");
const { upload } = require("../../middleware/upload.middleware");
const ratingController = require("../../controller/ProductManager/ratingController");


router.get("/ratings", ratingController.getAllRatings);
router.post(
  "/add",
  Authozation.authenticateToken,
  ratingController.createRating
);
router.delete(
  "/ratings/:ratingId",
  Authozation.authenticateToken,
  Authozation.authorizeRoles(3),
  ratingController.deleteRating
);
router.get("/ratings/:productId/stats", ratingController.getRatingStats);
// router.get("/ratings/by-base-product/:baseProductId", ratingController.getRatingsByBaseProduct);
router.get(
  "/ratings/:baseProductId",
  ratingController.getRatingsByBaseProduct
);

module.exports = router;

