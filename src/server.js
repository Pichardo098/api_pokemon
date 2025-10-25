// Load environment variables from .env file
require('dotenv').config({ path: '.env' });

// Import the Express application
const server = require('./index');

// Import configuration
const mongoose = require('mongoose');
const config = require('./config');

// Import modules
const http = require('http');

// Development environment MongoDB connection URI
const MONGO_URI = `mongodb://${config.db.host}/${config.db.name}`;

// Define environment-based configuration
const PORT = config.nodeenv === 'test' ? config.port_test : config.port;
const HOST = config.nodeenv === 'test' ? config.hostTest : config.host;

// Set Mongoose Promise to global Promise
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected!');
    })
    .catch((error) => {
        console.log('Connection error ' + error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
    });

// Enable Mongoose debugging mode in non-production environments
if (config.nodeenv !== 'production') {
    mongoose.set('debug', true);
}

// Create and configure HTTP server
const httpServer = http.createServer(server);

// Start the HTTP server
httpServer.listen(PORT, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
});

module.exports = server;
