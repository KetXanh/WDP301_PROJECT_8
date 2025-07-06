const userAuthRouter = require('./userAuth')
const userProductRouter = require('./products')
const userOrderRouter = require('./order')
const userCartRouter = require('./cart')
const userVnpayRouter = require('./vnpay')
module.exports = (app) => {
    const api = "/api/user";
    app.use(api + "/auth", userAuthRouter);
    app.use(api + "/products", userProductRouter);
    app.use(api + "/orders", userOrderRouter);
    app.use(api + "/carts", userCartRouter);
    app.use(api + "/vnpay", userVnpayRouter);
}