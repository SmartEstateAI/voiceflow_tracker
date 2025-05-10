const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const RedisClient = require("../utils/redis-client");
const RedisRateLimiter = require("../utils/redis-rate-limiter");

const router = express.Router();
require('dotenv').config();

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

const proxy = createProxyMiddleware({
    target: process.env.VOICE_FLOW_HOST,
    changeOrigin: true,
});

router.use(async (req, res, next) => {
    if (req.path.includes('/interact')) {
        const canUseProxy = await RedisRateLimiter.call(req);
        if (!canUseProxy){
            return res.status(429).send('Maximal usage exceeded');
        }
    }

    await proxy(req, res, next);
});


module.exports = router;
