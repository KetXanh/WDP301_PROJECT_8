const categoryRouter = require('./Category')
const productRouter = require('./Product')
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/product/category", categoryRouter);
    app.use(api + "/product/product", productRouter);
}
