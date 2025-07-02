const express = require("express");
const router = express.Router();
const statisticsController = require("../../controller/SaleManager/statistics");
const authMiddleware = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/auth");

// Statistics routes
router.get("/overview", statisticsController.getStatistics);
router.get("/products", statisticsController.getProductStatistics);
router.get("/orders", statisticsController.getOrderStatistics);
router.get("/customers", statisticsController.getCustomerStatistics);
router.get("/loyal-customers", statisticsController.getLoyalCustomer);
router.get("/kpi", statisticsController.getKPIStatistics);

module.exports = router; 