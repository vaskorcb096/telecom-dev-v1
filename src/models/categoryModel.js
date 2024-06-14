const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: [true, "Category Name is required"],
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

const Category = model("Categories", categorySchema);
module.exports = Category;
