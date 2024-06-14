const express = require('express')
const brandRouter = express.Router()
const { createBrand, getBrands, updateBrand } = require('../controllers/brandController')

brandRouter.post('/', createBrand)
brandRouter.get('/:id', getBrands)
brandRouter.patch('/:id', updateBrand)

module.exports = brandRouter