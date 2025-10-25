// Import the express module
const express = require('express');

// Load environment variables from the .env file
require('dotenv').config({ path: '.env' });

// Import configuration and other utilities
const cors = require('cors');
const config = require('./config');
const globalErrorHandler = require('./controllers/error-controller');
const AppError = require('./utils/appError');

// Create an Express app
const app = express();

// Disable the "X-Powered-By" header for security
app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Manual CORS header configuration (optional but consistent)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Allow', '*');
    next();
});

// Create an initial router
const initialRoute = express.Router();

// Root route
initialRoute.get('/', (req, res) => {
    res.json({
        message: `Welcome to POKE API`,
        port: config.port
    });
});

// Simple health check endpoint
initialRoute.get('/conection', (req, res) => {
    res.sendStatus(200);
});

// Register routes
app.use('/', initialRoute);
app.use(require('./routes'));

// 404 handler
app.use((req, res, next) => {
    next(new AppError(`No se encontró la URL solicitada: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Export the app
module.exports = app;
