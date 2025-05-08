const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
    res.send('Hello from the routes folder!');
});

router.get('/test', (req, res) => {
    res.send('This is the about page.');
});

router.get('/:id', (req, res) => {
    res.send(`User ID: ${req.params.id}`);
});

module.exports = router;
