const express = require("express");
const router = express.Router();
const kpiController = require("../../controller/SaleManager/kpiController");

// Thêm middleware auth nếu cần

router.post("/kpi/", kpiController.createKPI);
router.get("/kpi/", kpiController.getKPIs);
router.get("/kpi/:id", kpiController.getKPIById);
router.put("/kpi/:id", kpiController.updateKPI);
router.delete("/kpi/:id", kpiController.deleteKPI);

module.exports = router;
