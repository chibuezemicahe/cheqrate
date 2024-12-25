require('dotenv').config();
const mongoose = require('mongoose');

// Define the exchange rate schema
const exchangeRateSchema = new mongoose.Schema({
    pair_code: { type: String, required: true },
    changer_code: { type: String, required: true },
    price_buy: { type: Number, required: true },
    price_sell: { type: Number, required: true },
    updated_at: { type: Date, required: true },
});

// Create and export the model
const ExchangeRate = mongoose.model('ExchangeRate', exchangeRateSchema);

module.exports = ExchangeRate;
