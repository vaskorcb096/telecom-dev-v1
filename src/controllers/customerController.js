const createError = require("http-errors");
const Customer = require("../models/customerModel");
const { successResponse } = require("./responseController");

const createCustomer = async (req, res, next) => {
  try {
    const { customer_name, email, phone, address, shop_name, company } =
      req.body;

    const newCustomer = {
      customer_name,
      email,
      phone,
      address,
      shop_name,
      company,
      dueAmount: 0
    };

    await Customer.create(newCustomer);

    const customers = await Customer.find({ company: company });
    customers.reverse();

    return successResponse(res, {
      statusCode: 200,
      message: "Successfully created a customer",
      payload: { customers },
    });
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const customers = await Customer.find({ company: userId }).populate('invoiceList');
    if (!customers) throw createError(404, "No Customers found");
    return successResponse(res, {
      statusCode: 200,
      message: "Customers return successfully",
      payload: { customers },
    });
  } catch (error) {
    next(error);
  }
};
const getCustomer = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log("asss", userId);
    const customer = await Customer.findById(userId);
    console.log("customers", customer);
    if (!customer) throw createError(404, "No Customers found");
    return successResponse(res, {
      statusCode: 200,
      message: "Customers return successfully",
      payload: { customer },
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const updates = req.body;
    const customerId = req.params.id;

    const customerExists = await Customer.findById(customerId);

    if (!customerExists) {
      throw createError(404, "Customer not found");
    }

    for (let key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (customerExists[key] !== undefined) {
          customerExists[key] = updates[key];
        }
      }
    }

    await customerExists.save();

    const customers = await Customer.find({ company: customerExists.company });

    return successResponse(res, {
      statusCode: 200,
      message: "Customer information updated successfully",
      payload: { customers },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCustomer, getCustomers, updateCustomer, getCustomer };
