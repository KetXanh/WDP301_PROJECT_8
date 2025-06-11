const saleManagerRouter = require('./saleManager')
const taskRoutes = require("./taskRoutes");
const taskAssignmentRoutes = require("./taskAssignmentRoutes");
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/saleManager", saleManagerRouter);
    app.use(api + "/task", taskRoutes);
    app.use(api + "/taskAssignment", taskAssignmentRoutes);
}
