const express = require('express');
const router = express.Router();
const exchangeRateController = require('../controllers/ratesController');


// Here I Import the controller function
router.get('/rates', exchangeRateController.fetchExchangeRate);

module.exports = router;