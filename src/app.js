const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
// const rateLimit = require('express-rate-limit')
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const brandRouter = require("./routers/brandRouter");
const productRouter = require("./routers/productRouter");
const categoryRouter = require("./routers/categoryRouter");
const customerRouter = require("./routers/customerRouter");
const retailerRouter = require("./routers/retailerRouter");
const { errorResponse } = require("./controllers/responseController");
const salesRouter = require("./routers/salesRouter");
const app = express();

// const rateLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000,
//     max: 5,
//     message: 'Too many request from this ip, please try again later'
// })

// app.use(cors(
//     {
//         origin: ["https://choity-telecom.vercel.app"],
//         methods: ["POST", "GET"],
//         credentials: true
//     }
// ));

app.use(cors());
// app.use(rateLimiter)
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("v1/api/users", userRouter);
app.use("v1/api/categories", categoryRouter);
app.use("v1/api/brands", brandRouter);
app.use("v1/api/customers", customerRouter);
app.use("v1/api/retailers", retailerRouter);
app.use("v1/api/products", productRouter);
app.use("v1/api/sales", salesRouter);
app.use("v1/api/seed", seedRouter);

app.get("/", (req, res) => {
  res.send("Returns");
});

app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
