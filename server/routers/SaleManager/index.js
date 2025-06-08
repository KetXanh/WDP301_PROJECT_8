const saleManagerRouter = require('./saleManager')
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/saleManager", saleManagerRouter);
}
