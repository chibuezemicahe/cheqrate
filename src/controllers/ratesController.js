require('dotenv').config();
const { createClient } = require('redis');
const apiClient = require('../utils/apiClients');
const moment = require('moment');
const ExchangeRate = require('../model/rate-model');


// Create a Redis client instance using Redis Cloud credentials
const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

// Connect to Redis Cloud
client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect(); // Ensure the client is connected before using it
        console.log('Redis Client Connected');
    } catch (err) {
        console.error('Redis Connection Error:', err.message);
    }
})();

// Helper to get cached data from Redis
async function getCachedData(key) {
    const cachedData = await client.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return null;
}

// Helper to cache data in Redis
async function setCachedData(key, data, expirationTime = 3600) {
    await client.setEx(key, expirationTime, JSON.stringify(data)); // Use setEx for expiry
}

// Fetch exchange rates from Monierate API
async function fetchExchangeRate() {
    console.log(process.env.MONIERATE_API);

    // Check if exchange rates are cached in Redis
    const cachedRates = await getCachedData('exchangeRates:usdngn');
    if (cachedRates) {
       
        console.log('Returning cached exchange rates');
        console.log('Processed Data:', cachedRates);
        return cachedRates;
    }

    try {
        const response = await apiClient.get('https://monierate.com/api/pairs/changers', {
            params: {
                pair_code: 'usdngn',
            }
        });
    


        // Process the data and format it to pic
        const processedData = response.data.map(item => ({
            id: item._id, // Extract ID
            changer_code: item.changer_code, // Extract changer code
            updated_at: moment(item.updated_at).fromNow(), // Extract timestamp
            price_buy: item.price_buy, // Extract buy price
            price_sell: item.price_sell, // Extract sell price
        }));

        // Cache the processed data in Redis for 1 hour
        await setCachedData('exchangeRates:usdngn', processedData, 3600);
        console.log('Processed Data:', processedData);
        return processedData;

    } catch (error) {
        console.error('Error fetching rates:', error.message);

        try{
            const fallbackRates = await ExchangeRate.find({ pair_code: 'usdngn' })
            .sort({ updated_at: -1 }) // Sort by the most recent
            .limit(10); // Fetch last 
    
            // Condition statement to check if fallbackRates lenght available then it is returned 
            if (fallbackRates.length > 0){
                console.log('Returning data from MongoDB as a fallback');
                return fallbackRates;
            } 
            else {
                throw new Error('No data available in MongoDB');
            }
        } catch(dbError){
            console.error('Error fetching from MongoDB:', dbError.message);
            throw new Error('Failed to retrieve exchange rates from all sources');
        }
      
    }
}

module.exports = { fetchExchangeRate };
