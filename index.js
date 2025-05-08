const express = require('express');
const app = express();
const routes = require('./routes/index');
const PORT = process.env.PORT || 3000;

// Middleware (optional example)
app.use(express.json());

// Use Routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
