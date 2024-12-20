const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Exchange rates endpoint' });
});

module.exports = router;