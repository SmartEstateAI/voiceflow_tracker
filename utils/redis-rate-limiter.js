const RedisClient = require("./redis-client")
const { RateLimiterRedis } = require('rate-limiter-flexible');

class RedisRateLimiter {


    static call = async (req) => {
        const {projectId, userId} = req.params;
        const client = new RedisClient()
        await client.connect();

        const opts = {
            storeClient: client.redis,

            // Pull values from env for flexibility
            points: parseInt(process.env.RATE_LIMIT_POINTS || '1000'), // e.g. 1000 messages
            duration: parseInt(process.env.RATE_LIMIT_DURATION || (60 * 60 * 24 * 30).toString()), // e.g. 1 month

            blockDuration: 0, // Don't block after limit, just reject

            keyPrefix: 'voice-flow-project-limit', // important to keep distinct from other limiters
        };

        const rateLimiterRedis = new RateLimiterRedis(opts);

        await new Promise((res) => {
            // pro projekt einer hochzählen
            rateLimiterRedis.consume(projectId)
                .then((rateLimiterRes) => {
                    console.log('[RedisRateLimiter.call] success', rateLimiterRes)
                    client.disconnect();
                    res(true)
                })
                .catch((rejRes) => {
                    console.log('[RedisRateLimiter.call] error', rejRes)
                    if (rejRes instanceof Error) {
                        // TODO add some error handling here
                        client.disconnect();
                        res(false)
                    } else {
                        // TODO add some error handling here
                        client.disconnect();
                        res(false)
                    }
                });
        })
    }


}

module.exports = RedisRateLimiter