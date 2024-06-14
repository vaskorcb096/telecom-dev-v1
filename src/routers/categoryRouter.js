const express = require('express')
const categoryRouter = express.Router()
const { createCategory, getCategories, updateCategory } = require('../controllers/categoryController')

categoryRouter.post('/', createCategory)
categoryRouter.get('/:id', getCategories)
categoryRouter.patch('/:id', updateCategory)

module.exports = categoryRouter