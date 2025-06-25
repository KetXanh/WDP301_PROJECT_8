const saleStaffRouter = require("./saleStaff.router");
const orderRoutes = require("./orderRoutes");

module.exports = (app) => {
    const api = "/api";
    app.use(api + "/saleStaff", saleStaffRouter);
    app.use(api + "/saleStaff/order", orderRoutes);
}