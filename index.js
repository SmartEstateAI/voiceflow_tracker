const express = require('express');
const app = express();
const routes = require('./routes/index');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
require('dotenv').config();

// Allow ALL origins
app.use(cors());

// json middleware
app.use(express.json());

// Use Routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('🟥 Uncaught Exception:', err.stack || err);
    process.exit(1); // Optional: force exit to avoid hanging
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🟧 Unhandled Rejection:', reason);
});