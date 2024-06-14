const express = require("express");
const salesRouter = express.Router();
const { getSales, createReturnProduct, getReturnProduct } = require("../controllers/createBillController");

salesRouter.get("/:id", getSales);
salesRouter.get("/return-product/:id", getReturnProduct);
salesRouter.post("/return-product", createReturnProduct);

module.exports = salesRouter;
