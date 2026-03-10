require('dotenv').config();

const express = require('express');
const app = express();

const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const responderRoutes = require('./routes/responderRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api', userRoutes);
app.use('/api', responderRoutes);
app.use('/api', incidentRoutes);


// Default route
app.get('/', (req, res) => {
    res.send('Sagip Manileño Backend Running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});