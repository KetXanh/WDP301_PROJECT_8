const userAuthRouter = require('./userAuth')
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/user/auth", userAuthRouter);
}