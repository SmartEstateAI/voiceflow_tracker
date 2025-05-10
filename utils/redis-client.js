// RedisClient.js
const Redis = require('ioredis');

class RedisClient {
    constructor(options = {}) {
        // Use defaults if options not provided
        this.host = options.host || process.env.REDIS_HOST;
        this.port = options.port || process.env.REDIS_PORT;
        this.password = options.password || process.env.REDIS_PW;

        this.redis = null;
    }

    connect() {
        if (!this.redis) {
            this.redis = new Redis({
                host: this.host,
                port: this.port,
                password: this.password,
            });

            this.redis.on('connect', () => {
                console.log('✅ Redis connected');
            });

            this.redis.on('error', (err) => {
                console.error('❌ Redis error:', err);
            });
        }

        return this.redis;
    }

    getClient() {
        if (!this.redis) {
            throw new Error('Redis connection not initialized. Call connect() first.');
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
