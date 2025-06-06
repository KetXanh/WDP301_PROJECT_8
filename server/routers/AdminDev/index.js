const adminRouter = require('./admin.router');
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/admin", adminRouter);
}