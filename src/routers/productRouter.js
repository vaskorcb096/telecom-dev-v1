const express = require('express')
const productRouter = express.Router()
const { createProduct, getProducts, updateProduct } = require('../controllers/productController')

productRouter.post('/', createProduct)
productRouter.get('/:id', getProducts)
productRouter.patch('/:id', updateProduct)

module.exports = productRouter
