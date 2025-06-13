const userAuthRouter = require('./userAuth')
const userProductRouter = require('./products')
module.exports = (app) => {
    const api = "/api/user";
    app.use(api + "/auth", userAuthRouter);
    app.use(api + "/products", userProductRouter);
}