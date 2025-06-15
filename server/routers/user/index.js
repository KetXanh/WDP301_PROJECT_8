const userAuthRouter = require('./userAuth')
const userProductRouter = require('./products')
const userOrderRouter = require('./order')
module.exports = (app) => {
    const api = "/api/user";
    app.use(api + "/auth", userAuthRouter);
    app.use(api + "/products", userProductRouter);
    app.use(api + "/orders", userOrderRouter);
}