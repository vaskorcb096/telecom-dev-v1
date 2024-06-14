const createError = require('http-errors')
const Category = require('../models/categoryModel')
const { successResponse } = require('./responseController')

const createCategory = async (req, res, next) => {
    try {
        const { category_name, company } = req.body;

        const categoryExists = await Category.findOne({
            category_name: { $regex: new RegExp(`^${category_name}$`, 'i') },
            company: company
        });

        if (categoryExists) {
            throw createError(409, "Category already exists.")
        }

        const newCategory = {
            category_name, company
        }

        await Category.create(newCategory)

        const categories = await Category.find({ company: company })

        return successResponse(res, {
            statusCode: 200,
            message: 'Successfully created a category',
            payload: { categories }
        })

    } catch (error) {
        next(error)
    }
};

const getCategories = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const categories = await Category.find({ company: userId })

        if (!categories) throw createError(404, "No categories found")

        return successResponse(res, {
            statusCode: 200,
            message: 'Categories return successfully',
            payload: { categories }
        })
    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { category_name } = req.body;
        const categoryId = req.params.id;

        const categoryExists = await Category.findById(categoryId);

        if (!categoryExists) {
            throw createError(404, "Category not found");
        }

        if (category_name && category_name !== categoryExists.category_name) {
            const categoryWithSameName = await Category.findOne({
                category_name: { $regex: new RegExp(`^${category_name}$`, 'i') },
                company: categoryExists.company
            });

            if (categoryWithSameName) {
                throw createError(409, "Another category with the same name already exists.");
            }
        }

        categoryExists.category_name = category_name || categoryExists.category_name;

        await categoryExists.save();

        const categories = await Category.find({ company: categoryExists.company })

        return successResponse(res, {
            statusCode: 200,
            message: 'Category updated successfully',
            payload: { categories }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCategory, getCategories, updateCategory }
