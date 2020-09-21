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
      protocol: configHandler.loadConfigFile().rabbitmq.protocol,
      hostname: configHandler.loadConfigFile().rabbitmq.host,
      port: configHandler.loadConfigFile().rabbitmq.port,
      // username: configHandler.loadConfigFile().rabbitmq.username,
      // password: configHandler.loadConfigFile().rabbitmq.password,
      // heartbeat: configHandler.loadConfigFile().rabbitmq.heartbeat,
    };

    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    channel.on('close', () => { logger.error('Close event emitted!') });
    channel.on('error', err => { logger.error('Error event emitted!') });

    await channel.checkQueue(configHandler.loadConfigFile().rabbitmq.queue);

    try {
      const content = Buffer.from(JSON.stringify(payload));
      await channel.sendToQueue(configHandler.loadConfigFile().rabbitmq.queue, content, { persistent: true });

      return res.status(200).send('Payload accepted');
    }
    catch (e) {
      logger.error(e);
      return res.status(502).send('Failed to send payload to RabbitMQ');
    }
  }
  catch (e) {
    logger.error(e);
    if (e === 902) return res.status(400).send(`${e}`);
    return res.status(502).send('Failed to connect to RabbitMQ');
  }
});
