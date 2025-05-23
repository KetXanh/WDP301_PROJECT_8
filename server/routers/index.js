const authRouter = require('./Auth/auth')
const userAuthRouter = require('./user/userAuth')
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/auth", authRouter);
    app.use(api + "/user/auth", userAuthRouter);
}