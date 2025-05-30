const categoryRouter = require('./Category')
const productRouter = require('./Product')
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/productmanager/category", categoryRouter);
    app.use(api + "/productmanager/product", productRouter);
}
