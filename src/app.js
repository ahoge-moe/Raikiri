/**
 * @module app
 * This module is an Express app that exposes routes 
 * and push incoming payloads onto the queue
 */

// Import node modules
const express = require('express');
const path = require('path');
const logger = require('logger');

// Import custom modules
const configHandler = require(path.join(process.cwd(), 'src/utils/configHandler.js'));

// Import routes
const queueGet = require(path.join(process.cwd(), 'src/routes/queue/get.js'));
const queuePost = require(path.join(process.cwd(), 'src/routes/queue/post.js'));

// Create ExpressJS app
const app = express();

// Use "express.text()" to parse incoming requests payload as a plain string
// This allows us to handle the "JSON.parse()" on our own and wrap it around a "try..catch" block
// And supress the ugly error message if the payload has incorrect JSON syntax
app.use(express.text({ type: 'application/json' }));

// Define routes
app.use(queuePost);
app.use(queueGet);

app.listen(configHandler.loadConfigFile().express.port, () => {
  logger.info(`Running on http://localhost:${configHandler.loadConfigFile().express.port}/`, logger.colors.underscore + logger.colors.green);
});
