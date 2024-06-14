const { Schema, model } = require("mongoose");

const ProductSaleSchema = new Schema(
  {
    invoiceNo: {
      type: Number,
      required: [true, "Invoice is required"],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      required: [true, "customer  is required"],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "customer  is required"],
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: [true, "Product is required"],
        },
        product_quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
        },
        product_price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        proft_or_loss: {
          type: Number,
        },
      },
    ],

    discount: {
      type: Number,
      required: [true, "Discount is required"],
    },
    receiveAmount: {
      type: Number,
      required: [true, "receiveAmount is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "total amount is required"],
    },
    total_profit_loss: {
      type: Number,
    },
    dueAmount: {
      type: Number,
    },
    payment_method: {
      type: String,
      required: [true, "payment method is required"],
    },
  },
  { timestamps: true }
);

const ProductSale = model("ProductsSale", ProductSaleSchema);
module.exports = ProductSale;
