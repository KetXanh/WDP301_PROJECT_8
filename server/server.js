const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const connectDb = require('./config/db')

const userRouter = require('./routers/user/index')
const authRouter = require('./routers/Auth/index')
const productRouter = require('./routers/ProductManager/index')
const saleManager = require('./routers/SaleManager/index')
const chatRouter = require('./routers/chatbot/index')
require('dotenv').config(); 

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

userRouter(app) 
authRouter(app)
productRouter(app)
saleManager(app)
chatRouter(app)
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on port ${PORT}`);
});