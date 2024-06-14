const { Schema, model } = require("mongoose");

const retailerSchema = new Schema(
  {
    retailer_name: {
      type: String,
      required: [true, "Retailer name is required"],
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
    company_name: {
      type: String,
      required: [true, "Company name is required"],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const Retailer = model("Retailers", retailerSchema);
module.exports = Retailer;
