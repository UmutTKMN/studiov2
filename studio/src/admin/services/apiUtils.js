import api from './api';

// Basit önbellekleme mekanizması
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

export const apiUtils = {
  /**
   * Önbellekleme desteği ile GET isteği gönderir
   */
  cachedGet: async (url, options = {}) => {
    const cacheKey = url + JSON.stringify(options);
    
    // Önbellekte varsa ve süresi geçmediyse önbellekten al
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return { data, fromCache: true };
      }
    }
    
    // Yoksa API'den getir ve önbelleğe ekle
    try {
      const response = await api.get(url, options);
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      return { data: response.data, fromCache: false };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Önbelleği temizler
   */
  clearCache: (urlPattern = null) => {
    if (urlPattern) {
      // Belirli bir URL kalıbına sahip önbellek girdilerini temizle
      for (const key of cache.keys()) {
        if (key.includes(urlPattern)) {
          cache.delete(key);
        }
      }
    } else {
      // Tüm önbelleği temizle
      cache.clear();
    }
  },
  
  /**
   * URL parametrelerini oluşturur
   */
  buildQueryParams: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  },
  
  /**
   * Multipart/form-data için header oluşturur
   */
  getMultipartHeaders: () => ({
    'Content-Type': 'multipart/form-data'
  }),
  
  /**
   * JSON için header oluşturur
   */
  getJsonHeaders: () => ({
    'Content-Type': 'application/json'
  })
};
