const userAuthRouter = require('./userAuth')
const userProductRouter = require('./products')
const userOrderRouter = require('./order')
const userCartRouter = require('./cart')
const userDiscountRouter = require('./userDiscount')
const userVnpayRouter = require('./vnpay')
const userRatingRouter = require('./ratings')
module.exports = (app) => {
    const api = "/api/user";
    app.use(api + "/auth", userAuthRouter);
    app.use(api + "/products", userProductRouter);
    app.use(api + "/orders", userOrderRouter);
    app.use(api + "/carts", userCartRouter);
    app.use(api + "/discounts", userDiscountRouter);
    app.use(api + "/vnpay", userVnpayRouter);
    app.use(api + "/rating", userRatingRouter);
}