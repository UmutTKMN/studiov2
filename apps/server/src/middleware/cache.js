const redis = require('redis');
const { promisify } = require('util');
const config = require('@config');
const logger = require('../utils/logger');

class Cache {
    constructor() {
        try {
            if (!config.redis || !config.redis.host) {
                logger.warn('Redis yapılandırması bulunamadı, önbellek devre dışı bırakıldı');
                this.enabled = false;
                return;
            }
            
            this.enabled = true;
            this.client = redis.createClient({
                host: config.redis.host,
                port: config.redis.port || 6379,
                password: config.redis.password || undefined,
                retry_strategy: (options) => {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        logger.error('Redis sunucusu reddetti, yeniden bağlanmayı deneyeceğiz');
                        return Math.min(options.attempt * 100, 3000);
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        logger.error('Redis yeniden bağlanma süresi aşıldı');
                        return undefined;
                    }
                    return Math.min(options.attempt * 100, 3000);
                }
            });

            this.client.on('error', (err) => {
                logger.error(`Redis bağlantı hatası: ${err.message}`);
                this.enabled = false;
            });
            
            this.client.on('connect', () => {
                logger.info('Redis bağlantısı kuruldu');
                this.enabled = true;
            });
            
            this.get = promisify(this.client.get).bind(this.client);
            this.set = promisify(this.client.set).bind(this.client);
            this.del = promisify(this.client.del).bind(this.client);
            this.keys = promisify(this.client.keys).bind(this.client);
            
        } catch (error) {
            logger.error(`Redis önbellek sistemi başlatılamadı: ${error.message}`);
            this.enabled = false;
        }
    }

    // Cache middleware
    cacheMiddleware(duration = 300) { // Varsayılan 5 dakika
        return async (req, res, next) => {
            if (!this.enabled || req.method !== 'GET') {
                return next();
            }

            // Cache anahtarını oluştur (URL + kullanıcıya özel)
            const userId = req.user ? req.user.id : 'guest';
            const key = `cache:${userId}:${req.originalUrl}`;

            try {
                const cachedData = await this.get(key);
                if (cachedData) {
                    logger.debug(`Önbellekten yanıt verildi: ${key}`);
                    return res.json(JSON.parse(cachedData));
                }

                // Response'u yakala
                const originalSend = res.json;
                res.json = (body) => {
                    // Hata yanıtlarını önbelleğe alma
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        this.set(key, JSON.stringify(body), 'EX', duration);
                    }
                    originalSend.call(res, body);
                };

                next();
            } catch (error) {
                logger.error(`Önbellek hatası: ${error.message}`);
                next();
            }
        };
    }

    // Cache'i temizle
    async clearCache(pattern = 'cache:*') {
        if (!this.enabled) {
            return false;
        }
        
        try {
            const keys = await this.keys(pattern);
            if (keys.length > 0) {
                await this.del(keys);
                logger.info(`${keys.length} önbellek öğesi temizlendi: ${pattern}`);
                return true;
            }
            return false;
        } catch (error) {
            logger.error(`Önbellek temizleme hatası: ${error.message}`);
            return false;
        }
    }
    
    // Belirli bir kullanıcının önbelleğini temizle
    async clearUserCache(userId) {
        return this.clearCache(`cache:${userId}:*`);
    }
}

module.exports = new Cache();