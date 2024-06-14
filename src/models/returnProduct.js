const { Schema, model } = require("mongoose");

const ReturnProductSchema = new Schema(
    {
        invoiceNo: {
            type: Number,
            required: [true, "Invoice is required"],
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: [true, "product  is required"],
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
        },
        total_price: {
            type: Number,
            required: [true, "Product total price is required"],
        },
        returnReason: {
            type: String,
        },
    },
    { timestamps: true }
);

const ReturnProduct = model("ReturnProduct", ReturnProductSchema);
module.exports = ReturnProduct;
