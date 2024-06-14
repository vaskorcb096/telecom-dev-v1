const moment = require("moment");
const createError = require("http-errors");
// const Ledger = require('../models/ledgerModel');
const Product = require("../models/productModel");
const { successResponse } = require("./responseController");

const createProduct = async (req, res, next) => {
  try {
    const {
      product_name,
      category,
      brand,
      price,
      quantity,
      retailer,
      memo_ref,
      item_type,
      stock_out_alert,
      description,
      company,
    } = req.body;

    const createdAt = new Date();

    const expired_date = moment(createdAt).add(60, "days").toDate();

    const newProduct = {
      product_name,
      category,
      brand,
      price,
      quantity,
      retailer,
      memo_ref,
      item_type,
      stock_out_alert,
      description,
      expired_date,
      company,
    };

    await Product.create(newProduct);
    // await Ledger.create({ retailer, company, memo_ref })

    const products = await Product.find({ company: company })
      .populate("category")
      .populate("brand")
      .populate("retailer")
      .populate("company");

    return successResponse(res, {
      statusCode: 200,
      message: "Successfully created a product",
      payload: { products },
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const role = req.query.role;
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [{ memo_ref: { $regex: searchRegExp } }],
    };

    if (role !== "superAdmin") {
      filter.company = userId;
    }

    const count = await Product.find(filter).countDocuments();

    const products = await Product.find(filter)
      .populate("category")
      .populate("brand")
      .populate("retailer")
      .populate("company")
      .limit(limit)
      .skip((page - 1) * limit);

    if (!products) throw createError(404, "No products found");

    return successResponse(res, {
      statusCode: 200,
      message: "Products return successfully",
      payload: {
        products,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updates = req.body;
    const productId = req.params.id;

    const productExists = await Product.findById(productId);

    if (!productExists) {
      throw createError(404, "Product not found");
    }

    for (let key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (productExists[key] !== undefined) {
          productExists[key] = updates[key];
        }
      }
    }

    await productExists.save();

    const products = await Product.find({ company: productExists.company })
      .populate("category")
      .populate("brand")
      .populate("retailer");

    return successResponse(res, {
      statusCode: 200,
      message: "Product updated successfully",
      payload: { products },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct, getProducts, updateProduct };
