const saleManagerRouter = require('./saleManager')
const taskRoutes = require("./taskRoutes");
const taskAssignmentRoutes = require("./taskAssignmentRoutes");
const orderRoutes = require("./orderRoutes");
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/saleManager", saleManagerRouter);
    app.use(api + "/task", taskRoutes);
    app.use(api + "/taskAssignment", taskAssignmentRoutes);
    app.use(api + "/order", orderRoutes);
}
