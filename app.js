const express = require ('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

