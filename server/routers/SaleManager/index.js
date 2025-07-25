const saleManagerRouter = require('./saleManager')
const taskRoutes = require("./taskRoutes");
const taskAssignmentRoutes = require("./taskAssignmentRoutes");
const orderRoutes = require("./orderRoutes");
const statisticsRoutes = require("./statisticsRoutes");
const discountRoutes = require("./discountRoutes");

module.exports = (app) => {
    const api = "/api";
    app.use(api + "/saleManager", saleManagerRouter);
    app.use(api + "/saleManager/task", taskRoutes);
    app.use(api + "/saleManager/taskAssignment", taskAssignmentRoutes);
    app.use(api + "/saleManager/order", orderRoutes);
    app.use(api + "/saleManager/statistics", statisticsRoutes);
    app.use(api + "/saleManager/discount", discountRoutes);
}
