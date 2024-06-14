const createError = require("http-errors");
const Ledger = require("../models/ledgerModel");
const Retailer = require("../models/retailerModel");
const { successResponse } = require("./responseController");

const createRetailer = async (req, res, next) => {
  try {
    const { retailer_name, email, phone, company_name, address, company } =
      req.body;

    const newRetailer = {
      retailer_name,
      email,
      phone,
      company_name,
      address,
      company,
    };

    await Retailer.create(newRetailer);

    const retailers = await Retailer.find({ company: company });

    return successResponse(res, {
      statusCode: 200,
      message: "Successfully created a retailer",
      payload: { retailers },
    });
  } catch (error) {
    next(error);
  }
};

const getRetailers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const role = req.query.role;
    const filter = {};
    if (role !== "superAdmin") {
      filter.company = userId;
    }
    const retailers = await Retailer.find(filter);
    if (!retailers) throw createError(404, "No retailers found");
    return successResponse(res, {
      statusCode: 200,
      message: "Retailers return successfully",
      payload: { retailers },
    });
  } catch (error) {
    next(error);
  }
};

const updateRetailer = async (req, res, next) => {
  try {
    const updates = req.body;
    const retailerId = req.params.id;

    const retailerExists = await Retailer.findById(retailerId);

    if (!retailerExists) {
      throw createError(404, "Retailer not found");
    }

    for (let key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (retailerExists[key] !== undefined) {
          retailerExists[key] = updates[key];
        }
      }
    }

    await retailerExists.save();

    const retailers = await Retailer.find({ company: retailerExists.company });

    return successResponse(res, {
      statusCode: 200,
      message: "Retailer information updated successfully",
      payload: { retailers },
    });
  } catch (error) {
    next(error);
  }
};

const getLedgers = async (req, res, next) => {
  try {
    const company_id = req.params.company_id;
    const retailer_id = req.params.retailer_id;
    const ledgers = await Ledger.find({
      company: company_id,
      retailer: retailer_id,
    });

    if (!ledgers) throw createError(404, "No ledgers found");

    return successResponse(res, {
      statusCode: 200,
      message: "Ledgers return successfully",
      payload: { ledgers },
    });
  } catch (error) {
    next(error);
  }
};

const createLedger = async (req, res, next) => {
  try {
    const { payment_type, amount, retailer, company } = req.body;

    const newLedger = {
      payment_type,
      amount,
      retailer,
      company,
    };

    await Ledger.create(newLedger);

    const ledgers = await Ledger.find({ company: company, retailer: retailer });

    return successResponse(res, {
      statusCode: 200,
      message: "Successfully created a ledger",
      payload: { ledgers },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRetailer,
  getRetailers,
  updateRetailer,
  getLedgers,
  createLedger,
};
