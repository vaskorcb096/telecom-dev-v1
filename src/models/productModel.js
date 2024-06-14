const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Minimum 3 char length"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: [true, "Product category is required"],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
      required: [true, "Brand is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    retailer: {
      type: Schema.Types.ObjectId,
      ref: "Retailers",
      required: [true, "Retailer is required"],
    },
    memo_ref: {
      type: String,
      required: [true, "Memo ref is required"],
    },
    item_type: {
      type: String,
      required: [true, "Item type is required"],
    },
    stock_out_alert: {
      type: Number,
      required: [true, "Stock out alert is required"],
    },
    description: {
      type: String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    expired_date: {
      type: String,
    }
  },
  { timestamps: true }
);

const Product = model("Products", productSchema);
module.exports = Product;
