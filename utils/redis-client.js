const Redis = require('ioredis');

class RedisClient {
    redis = null;

    async connect() {
        if (!this.redis) {
            const connectionString = process.env.REDIS_CONNECTION_STRING;

            if (!connectionString) {
                throw new Error('❌ Missing REDIS_CONNECTION_STRING env variable!');
            }

            console.log('Connecting to Redis with:', connectionString);

            return await new Promise(resolve => {
                this.redis = new Redis(connectionString);

                this.redis.on('connect', () => {
                    console.log('✅ Redis connected');
                    resolve(this.redis)
                });

                this.redis.on('error', (err) => {
                    console.error('❌ Redis error:', err);
                    resolve(null)
                });
            })
        }
        return this.redis;
    }

    disconnect() {
        if (this.redis) {
            this.redis.disconnect();
            console.log('🔌 Redis disconnected');
            this.redis = null;
        }
    }
}

module.exports = RedisClient;
