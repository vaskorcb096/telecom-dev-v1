const createError = require('http-errors')
const Brand = require('../models/brandModel')
const { successResponse } = require('./responseController')

const createBrand = async (req, res, next) => {
    try {
        const { brand_name, company } = req.body;

        const brandExists = await Brand.findOne({
            brand_name: { $regex: new RegExp(`^${brand_name}$`, 'i') },
            company: company
        });

        if (brandExists) {
            throw createError(409, "Brand already exists.")
        }

        const newBrand = {
            brand_name, company
        }

        await Brand.create(newBrand)

        const brands = await Brand.find({ company: company })

        return successResponse(res, {
            statusCode: 200,
            message: 'Successfully created a brand',
            payload: { brands }
        })

    } catch (error) {
        next(error)
    }
};

const getBrands = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const brands = await Brand.find({ company: userId })
        if (!brands) throw createError(404, "No brands found")

        return successResponse(res, {
            statusCode: 200,
            message: 'Brands return successfully',
            payload: { brands }
        })
    } catch (error) {
        next(error)
    }
}

const updateBrand = async (req, res, next) => {
    try {
        const { brand_name } = req.body;
        const brandId = req.params.id;

        const brandExists = await Brand.findById(brandId);

        if (!brandExists) {
            throw createError(404, "Brand not found");
        }

        if (brand_name && brand_name !== brandExists.brand_name) {
            const brandWithSameName = await Brand.findOne({
                brand_name: { $regex: new RegExp(`^${brand_name}$`, 'i') },
                company: brandExists.company
            });

            if (brandWithSameName) {
                throw createError(409, "Another brand with the same name already exists.");
            }
        }

        brandExists.brand_name = brand_name || brandExists.brand_name;

        await brandExists.save();

        const brands = await Brand.find({ company: brandExists.company })

        return successResponse(res, {
            statusCode: 200,
            message: 'Brand updated successfully',
            payload: { brands }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBrand, getBrands, updateBrand }
