// Import node modules
const amqp = require('amqplib');
const path = require('path');
const express = require('express');
const router = new express.Router();

// Import custom modules
const configHandler = require(path.join(process.cwd(), 'src/utils/configHandler.js'));

module.exports = router.get('/queue', async (req, res) => {
  // Check for authorization
  if (!configHandler.isAuthorized(req.get('Authorization'))) return res.status(401).send('Not authorized');

  try {
    const url = {
      protocol: configHandler.loadConfigFile().broker.protocol,
      hostname: configHandler.loadConfigFile().broker.host,
      port: configHandler.loadConfigFile().broker.port,
      // username: configHandler.loadConfigFile().broker.username,
      // password: configHandler.loadConfigFile().broker.password,
      // heartbeat: configHandler.loadConfigFile().broker.heartbeat,
    };
  
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    channel.on('close', () => { logger.error('Close event emitted!') });
    channel.on('error', err => { logger.error('Error event emitted!') });
  
    const queue = await channel.checkQueue(configHandler.loadConfigFile().broker.queue);
    return res.status(200).send(queue);
  }
  catch (e) {
    logger.error(e);
    return res.status(502).send('Failed to connect to broker');
  }
});
