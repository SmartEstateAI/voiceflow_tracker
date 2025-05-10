const RedisClient = require("./redis-client")
const { RateLimiterRedis } = require('rate-limiter-flexible');

class RedisRateLimiter {


    static call = async (req) => {

        const client = new RedisClient();
        client.connect();

        const opts = {
            // TODO put to env
            storeClient:  client.redis,
            points: 5, // Number of points
            duration: 5, // Per second(s)

            // Custom
            blockDuration: 0, // Do not block if consumed more than points
            keyPrefix: 'rlflx', // must be unique for limiters with different purpose
        };

        const rateLimiterRedis = new RateLimiterRedis(opts);

        rateLimiterRedis.consume(req.ip)
            .then((rateLimiterRes) => {
                client.disconnect();
                return true;
            })
            .catch((rejRes) => {
                if (rejRes instanceof Error) {
                    // TODO add some error handling here
                    client.disconnect();
                    return false
                } else {
                    // TODO add some error handling here
                    client.disconnect();
                    return false
                }
            });
    }


}

module.exports = RedisRateLimiter