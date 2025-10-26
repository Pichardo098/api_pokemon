const redis = require('redis');

// Import config
const config = require('../config');

// Create a Redis client
const client = redis.createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
  retryStrategy: (times) => {
    console.log(`Retrying Redis connection... (Retry ${times})`);
    return Math.min(times * 100, 2000);
  },
});

// Connect and handle errors
client.on('connect', () => console.log('Redis client connected!'));
client.on('error', (err) => console.error('Redis client error:', err));

client.on('end', () => {
  console.log('Redis client disconnected!');
  client.connect();
});

client.connect();

module.exports = client;
