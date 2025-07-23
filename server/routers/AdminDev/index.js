const adminRouter = require("./admin.router");
const blog = require("./blog");
module.exports = (app) => {
  const api = "/api";
  app.use(api + "/admin", adminRouter);
  app.use(api + "/blog", blog);
};
