const chatRouter = require('./chat.router')
module.exports = (app) => {
    const api = "/api";
    app.use(api + "/chat", chatRouter);
}