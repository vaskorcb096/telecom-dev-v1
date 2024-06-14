const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Minimum 3 char length"],
        maxlength: [31, "Maximum 31 char length"]
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        // validate: {
        //     validator: function (v) {
        //         return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        //     },
        //     message: 'Enter valid email'
        // }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Minimum 6 character length"],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    phone: {
        type: String,
        unique: true,
        required: [true, "Phone is required"],
    },
    role: {
        type: String,
        enum: ['superAdmin', 'company'],
        required: false,
    },

}, { timestamps: true });

const User = model('Users', userSchema);
module.exports = User