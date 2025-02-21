const redis = require('redis');
const { promisify } = require('util');
const config = require('@config');

class Cache {
    constructor() {
        this.client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password
        });

        this.client.on('error', (err) => console.log('Redis Client Error', err));
        
        this.get = promisify(this.client.get).bind(this.client);
        this.set = promisify(this.client.set).bind(this.client);
        this.del = promisify(this.client.del).bind(this.client);
    }

    // Cache middleware
    cacheMiddleware(duration) {
        return async (req, res, next) => {
            if (req.method !== 'GET') {
                return next();
            }

            const key = `cache:${req.originalUrl}`;

            try {
                const cachedData = await this.get(key);
                if (cachedData) {
                    return res.json(JSON.parse(cachedData));
                }

                // Response'u yakala
                const originalSend = res.json;
                res.json = (body) => {
                    this.set(key, JSON.stringify(body), 'EX', duration);
                    originalSend.call(res, body);
                };

                next();
            } catch (error) {
                next();
            }
        };
    }

    // Cache'i temizle
    async clearCache(pattern) {
        const keys = await promisify(this.client.keys).bind(this.client)(pattern);
        if (keys.length > 0) {
            await this.del(keys);
        }
    }
}

module.exports = new Cache(); 