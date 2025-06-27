const saleManagerRouter = require('./saleManager')
const taskRoutes = require("./taskRoutes");
const kpiRoutes = require("./kpiRoutes")
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/saleManager", saleManagerRouter);
    app.use(api + "/saleManager", taskRoutes);
    app.use(api + "/saleManager", kpiRoutes);
    
}
