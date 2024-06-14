const { Schema, model } = require("mongoose");

const brandSchema = new Schema(
  {
    brand_name: {
      type: String,
      required: [true, "Brand Name is required"],
      trim: true,
      minlength: [2, "Minimum 2 char length"],
      maxlength: [40, "Maximum 40 char length"],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const Brand = model("Brands", brandSchema);
module.exports = Brand;
