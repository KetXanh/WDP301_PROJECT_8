const categoryRouter = require("./Category");
const productRouter = require("./Product");
const ratingRouter = require("./Rating");
module.exports = (app) => {
  const api = "/api";
  app.use(api + "/productmanager/category", categoryRouter);
  app.use(api + "/productmanager/product", productRouter);
  app.use(api + "/productmanager/rating", ratingRouter);
};
