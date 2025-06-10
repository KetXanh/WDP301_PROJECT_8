const saleManagerRouter = require('./saleManager')
const taskRoutes = require("./taskRoutes");
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/saleManager", saleManagerRouter);
    app.use(api + "/saleManager", taskRoutes);
    
}
