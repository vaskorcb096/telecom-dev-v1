const express = require("express");
const { createBill, createPayment } = require("../controllers/createBillController");
const customerRouter = express.Router();
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  getCustomer,
} = require("../controllers/customerController");

customerRouter.post("/", createCustomer);
customerRouter.get("/:id", getCustomers);
customerRouter.get("/singleCustomer/:id", getCustomer);
customerRouter.patch("/:id", updateCustomer);
customerRouter.post("/create-bill", createBill);
customerRouter.post("/create-payment", createPayment);

module.exports = customerRouter;
