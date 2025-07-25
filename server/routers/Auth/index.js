const authRouter = require('./auth')
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/auth", authRouter);
}