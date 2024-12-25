
const axios = require('axios');

apiClient = axios.create({
    baseURL: process.env.MONIERATE_API,
    timeout: 5000,
});

module.exports = apiClient;