const createError = require("http-errors");
const Product = require("../models/productModel");
const Customer = require("../models/customerModel");
const ReturnProduct = require("../models/returnProduct");
const ProductSale = require("../models/ProductSaleModel");
const { successResponse } = require("./responseController");

const generateUniqueInvoiceNumber = async () => {
  let invoiceNumber;
  let existingInvoice;

  do {
    invoiceNumber = Math.floor(100000 + Math.random() * 900000).toString();
    existingInvoice = await ProductSale.findOne({ invoiceNo: invoiceNumber });
  } while (existingInvoice);

  return invoiceNumber;
};

const createBill = async (req, res, next) => {
  try {
    const {
      allProduct,
      priceList,
      quantityList,
      totalAmount,
      discount,
      receiveAmount,
      customer,
      company,
      payment_method,
    } = req.body;

    const productReferences = [];

    allProduct.forEach((product) => {
      console.log("here is our product", product);
      const p1 =
        parseInt(quantityList[product._id]) * parseInt(priceList[product._id]);
      const p2 = parseInt(quantityList[product._id]) * parseInt(product.price);
      productReferences.push({
        product: product._id,
        product_quantity: parseInt(quantityList[product._id]),
        product_price: parseInt(priceList[product._id]),
        proft_or_loss: p1 - p2,
      });
    });
    let total_profit_loss = 0;

    for (const productRef of productReferences) {
      const productId = productRef.product;
      const quantity = parseInt(productRef.product_quantity);
      total_profit_loss += productRef.proft_or_loss;

      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity: -quantity },
      });
    }

    const invoiceNumber = await generateUniqueInvoiceNumber();

    const productSale = await ProductSale.create({
      invoiceNo: invoiceNumber,
      customer: customer,
      company: company,
      products: productReferences,
      discount: discount,
      receiveAmount: receiveAmount,
      totalAmount: totalAmount,
      payment_method: payment_method,
      dueAmount: totalAmount - receiveAmount,
      total_profit_loss: total_profit_loss,
    });

    // Update the customer's invoiceList
    const updateCustomer = await Customer.findById(customer);
    updateCustomer.invoiceList.push(productSale._id);
    await updateCustomer.save();

    // Calculate the new total due amount for the customer
    const sales = await ProductSale.find({ customer: customer });
    const totalDueAmount = sales.reduce((sum, sale) => {
      const dueAmount = Number(sale.dueAmount);
      return sum + (isNaN(dueAmount) ? 0 : dueAmount);
    }, 0);

    // Update the customer's dueAmount field
    updateCustomer.dueAmount = totalDueAmount;
    await updateCustomer.save();
    updateCustomer.dueAmount = totalDueAmount;
    await updateCustomer.save();
  } catch (error) {
    next(error);
  }
};

const getSales = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const search = req.query.search || "";
    const role = req.query.role;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const customer =
      search.length > 0 &&
      (await Customer.find({ customer_name: searchRegExp }));

    if (!customer && search.length > 0)
      throw createError(404, "No Customer found");

    const filter = {};

    if (search.length > 0) {
      const customerIds = [];
      customer.forEach((customer) => {
        customerIds.push(customer._id);
      });
      filter.customer = { $in: customerIds };
    }
    if (role !== "superAdmin") {
      filter.company = companyId;
    }

    const count = await ProductSale.find(filter).countDocuments();
    const sales = await ProductSale.find(filter)
      .populate("customer")
      .populate("products.product")
      .populate("company")
      .limit(limit)
      .skip((page - 1) * limit);

    console.log("sales sales sales sales", sales);

    return successResponse(res, {
      statusCode: 200,
      message: "sales return successfully",
      payload: {
        sales,
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

const getReturnProduct = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const returnProducts = await ReturnProduct.find({
      company: companyId,
    }).populate("product");
    if (!returnProducts) throw createError(404, "No return product found");

    return successResponse(res, {
      statusCode: 200,
      message: "Return product successfully get",
      payload: { returnProducts },
    });
  } catch (error) {
    next(error);
  }
};

const createReturnProduct = async (req, res, next) => {
  try {
    const {
      invoiceNo,
      company,
      product,
      quantity,
      price,
      total_price,
      returnReason,
    } = req.body;

    const newReturnProduct = {
      invoiceNo,
      company,
      product,
      quantity,
      price,
      total_price,
      returnReason,
    };

    const returnData = await ReturnProduct.create(newReturnProduct);
    const salesData = await ProductSale.findOne({
      invoiceNo: newReturnProduct.invoiceNo,
    }).populate("products.product");
    let totalReducePrice = 0,
      total_update_profit_loss = 0;

    console.log("salesData,salesData", salesData.products[0].product);

    salesData.products = salesData.products.filter((item) => {
      if (item.product._id.toString() === returnData.product.toString()) {
        if (returnData.quantity === item.product_quantity) {
          const newPrice = item.product_price * item.product_quantity;
          totalReducePrice += newPrice;
          const prevPrice = item.product.price * item.product_quantity;
          const dif = prevPrice - newPrice;
          total_update_profit_loss += dif;

          return false; // Remove this item from the array
        }
        item.product_quantity -= returnData.quantity;
        const mul = item.product_price * returnData.quantity;
        totalReducePrice += mul;
        const newPrice = item.product_price * returnData.quantity;
        item.proft_or_loss -= newPrice;

        const prevPrice = item.product.price * item.product_quantity;

        total_update_profit_loss +=
          (item.product_quantity - returnData.quantity) * item.product_price;
      }
      return true; // Keep this item in the array
    });
    salesData.total_profit_loss = total_update_profit_loss;
    salesData.totalAmount -= totalReducePrice;
    if (salesData.dueAmount >= totalReducePrice) {
      salesData.dueAmount -= totalReducePrice;
    } else {
      salesData.dueAmount = 0;
      let dif = totalReducePrice - salesData.dueAmount;
      salesData.receiveAmount -= dif;
    }

    await salesData.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Product return successfully",
      payload: {},
    });
  } catch (error) {}
};

const createPayment = async (req, res, next) => {
  try {
    const { invoiceNo, paying_amount, payment_method } = req.body;

    const payingAmount = Number(paying_amount);

    // Find the ProductSale by invoiceNo
    const productSale = await ProductSale.findOne({ invoiceNo });

    if (!productSale) {
      return res.status(404).send({ message: "Invoice not found" });
    }

    // Update receiveAmount and calculate new dueAmount
    productSale.receiveAmount += payingAmount;
    productSale.dueAmount = productSale.totalAmount - productSale.receiveAmount;
    productSale.payment_method = payment_method;

    // Save the updated ProductSale document
    await productSale.save();

    // Update the Customer's invoiceList
    const customer = await Customer.findById(productSale.customer);
    if (!customer.invoiceList.includes(productSale._id)) {
      customer.invoiceList.push(productSale._id);
    }

    // Recalculate the total due amount for the customer
    const sales = await ProductSale.find({ customer: productSale.customer });
    customer.dueAmount = sales.reduce(
      (sum, sale) => sum + (sale.dueAmount || 0),
      0
    );

    // Save the updated Customer document
    await customer.save();

    const customers = await Customer.find({
      company: productSale.company,
      dueAmount: { $gt: 0 }
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Payment successfully",
      payload: { customers },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBill,
  getSales,
  createReturnProduct,
  getReturnProduct,
  createPayment,
};
