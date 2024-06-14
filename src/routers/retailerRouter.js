const express = require('express')
const retailerRouter = express.Router()
const { getRetailers, updateRetailer, createRetailer, getLedgers, createLedger } = require('../controllers/retailerController')

retailerRouter.post('/', createRetailer)
retailerRouter.get('/:id', getRetailers)
retailerRouter.patch('/:id', updateRetailer)
retailerRouter.post('/add-ledger', createLedger)
retailerRouter.get('/ledgers/:company_id/:retailer_id', getLedgers)

module.exports = retailerRouter
