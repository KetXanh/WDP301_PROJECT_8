const saleStaffRouter = require("./saleStaff.router");

module.exports = (app) => {
    const api = "/api";
    app.use(api + "/saleStaff", saleStaffRouter);
}