const express = require ('express');
const app = express();

const ratesRouter = require('./routes/rates');

// Here I am import my middleware
app.use(express.json());
app.use('rates', ratesRouter);

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to CheqRate API');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

