// Import node modules
const amqp = require('amqplib');
const path = require('path');
const express = require('express');
const router = new express.Router();

// Import custom modules
const configHandler = require(path.join(process.cwd(), 'src/utils/configHandler.js'));
const promisefied = require(path.join(process.cwd(), 'src/utils/promisefied.js'));

module.exports = router.post('/queue', async (req, res) => {
  try {
    // Check for authorization
    if (!configHandler.isAuthorized(req.get('Authorization'))) return res.status(401).send('Not authorized');
    // Check for content type
    if (req.get('Content-Type') !== 'application/json') return res.status(415).send('Content-Type must be application/json');
    // Check for JSON syntax. If it has wrong syntax, catch() will handle the error
    const payload = await promisefied.jsonParse(req.body);

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

    await channel.checkQueue(configHandler.loadConfigFile().broker.queue);

    try {
      const content = Buffer.from(JSON.stringify(payload));
      await channel.sendToQueue(configHandler.loadConfigFile().broker.queue, content, { persistent: true });

      return res.status(200).send('Payload accepted');
    }
    catch (e) {
      logger.error(e);
      return res.status(502).send('Failed to send payload to broker');
    }
  }
  catch (e) {
    logger.error(e);
    if (e === 902) return res.status(400).send(`${e}`);
    return res.status(502).send('Failed to connect to broker');
  }
});
