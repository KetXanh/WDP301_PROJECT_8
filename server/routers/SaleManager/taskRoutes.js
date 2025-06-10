const express = require("express");
const router = express.Router();
const taskController = require("../../controller/SaleManager/taskController");

router.post("/task", taskController.createTask);
router.get("/task", taskController.getTasks);
router.get("/task/:id", taskController.getTaskById);
router.put("/task/:id", taskController.updateTask);
router.delete("/task/:id", taskController.deleteTask);
router.get("/users", taskController.getAllUsers);

module.exports = router;
