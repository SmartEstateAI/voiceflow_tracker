const express = require('express');
const VoiceFlowProxyHandler = require("../handler/voice-flow-proxy-handler");
const { createProxyMiddleware } = require('http-proxy-middleware');
const RedisClient = require("../utils/redis-client");

const router = express.Router();

// Define routes
router.post('/v2/public/project/:projectId/user/:userId/interact/stream', async (req, res) => {
    await VoiceFlowProxyHandler.interact(req, res);
});
// Define routes
router.get('/v2/public/:projectId/settings/widget', async (req, res) => {
    await VoiceFlowProxyHandler.widget(req, res);
});

router.get('/api/ping', async (req, res) => {
    res.send('pong');
});

router.get('/api/ping-db', async (req, res) => {
    const client = new RedisClient();
    await client.connect();
    await client.redis.set('test', `${Date.now()}`);
    const value = await client.redis.get('test');
    res.send('pong-db + ' + value);
});


module.exports = router;
