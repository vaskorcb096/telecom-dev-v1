const { Schema, model } = require("mongoose");

const ledgerSchema = new Schema(
  {
    payment_type: {
      type: String,
      required: [true, "Payment type is required"],
    },
    amount: {
      type: String,
      required: [true, "Amount is required"],
    },
    retailer: {
      type: Schema.Types.ObjectId,
      ref: "Retailers",
      required: [true, "Retailer is required"],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Company is required"],
    },
  },
  { timestamps: true }
);

const Ledger = model("Ledgers", ledgerSchema);
module.exports = Ledger;
