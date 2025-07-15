// routes/user/rating.js
const express = require("express");
const router = express.Router();
const ratingController = require("../../controller/ProductManager/ratingController");
const Authozation = require("../../middleware/auth");

router.post(
  "/add",
  Authozation.authenticateToken,
  Authozation.authorizeRoles(0),
  ratingController.createRating
);

module.exports = router;
