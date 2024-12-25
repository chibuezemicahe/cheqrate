const cron = require('node-cron');
const ExchangeRate = require('../model/rate-model');
const { fetchExchangeRate } = require('../controllers/ratesController');

// Define the cron job
const saveExchangeRatesCron = cron.schedule('0 0 * * *', async () => {
    console.log('Cron job triggered at:', new Date()); // Log when the cron runs
    try {
        const data = await fetchExchangeRate();
        console.log('Fetched data:', data); // Log fetched data
        if (data && data.length > 0) {
            await Promise.all(
                data.map(async (rate) => {
                    const newRate = new ExchangeRate({
                        pair_code: 'usdngn',
                        changer_code: rate.changer_code,
                        price_buy: rate.price_buy,
                        price_sell: rate.price_sell,
                        updated_at: new Date(),
                    });
                    await newRate.save();
                })
            );
            console.log('Exchange rates saved to MongoDB');
        } else {
            console.log('No data to save');
        }
    } catch (error) {
        console.error('Error saving rates to MongoDB:', error.message);
    }
});

// Export the cron job
module.exports = saveExchangeRatesCron;
