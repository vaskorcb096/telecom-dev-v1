const { body } = require('express-validator')

const validateUserRegistration = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 31 })
        .withMessage('Name should be at least 3 to 31 characters long'),

    body("email")
        .trim(),
        // .notEmpty()
        // .withMessage('Email is required')
        // .isEmail()
        // .withMessage('Invalid email address'),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage('Phone is required'),

    body("address")
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 3 })
        .withMessage('Address should be at least 3 characters long'),

    body("role")
        .trim()
        .notEmpty()
        .withMessage('Role is required'),

    body("password")
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters long')
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    // .withMessage('Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
]

module.exports = { validateUserRegistration }