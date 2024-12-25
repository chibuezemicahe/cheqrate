require('dotenv').config();
const express = require ('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectToMongoDB = require('./src/utils/db');
const saveExchangeRatesCron = require('./src/tasks/saveExchangeRates');


const ratesRoutes= require('./src/routes/rates')


dotenv.config();
// Here I am import my middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Default Route
app.use('/api', ratesRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to CheqRate API');
});

// Here I start the Cron Task
saveExchangeRatesCron.start(); // Start the cron job

const PORT = process.env.PORT || 3000;


(async () => {

    try{
        await connectToMongoDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch(error){
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1); // Exit if the database connection fails
    }
})();

