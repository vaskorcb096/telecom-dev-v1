const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
  {
    customer_name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [3, "Minimum 3 char length"],
      maxlength: [31, "Maximum 31 char length"],
    },
    email: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    shop_name: {
      type: String,
      required: [true, "Shop name is required"],
    },
    dueAmount: {
      type: Number,
    },
    invoiceList: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductsSale",
      },
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const Customer = model("Customers", customerSchema);
module.exports = Customer;
