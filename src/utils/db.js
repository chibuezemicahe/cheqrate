require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongoDB() {
    try {
        // console.log(process.env.MONGODB_URI)
        await mongoose.connect('mongodb+srv://cheqrateAdmin:J34EVW53lvYMgNjH@cluster0.bk64p.mongodb.net/cheqrate?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1); // Exit the process if the connection fails
    }
}

module.exports = connectToMongoDB;
