/**
 * Standart API yanıtları için yardımcı fonksiyonlar
 */
class ApiResponse {
    /**
     * Başarılı API yanıtı
     * @param {Object} res - Express response objesi
     * @param {number} statusCode - HTTP durum kodu
     * @param {string} message - Mesaj
     * @param {any} data - Döndürülecek veri
     * @param {Object} meta - Meta veriler (sayfalama, vb.)
     */
    static success(res, statusCode = 200, message = 'İşlem başarılı', data = null, meta = null) {
        const response = {
            success: true,
            message
        };

        if (data !== null) {
            response.data = data;
        }

        if (meta !== null) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Başarısız API yanıtı
     * @param {Object} res - Express response objesi
     * @param {number} statusCode - HTTP durum kodu
     * @param {string} message - Hata mesajı
     * @param {Array|Object} errors - Hata detayları
     */
    static error(res, statusCode = 400, message = 'İşlem başarısız', errors = null) {
        const response = {
            success: false,
            message
        };

        if (errors !== null) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Liste içeren API yanıtı (sayfalandırma desteği ile)
     * @param {Object} res - Express response objesi
     * @param {Array} items - Liste öğeleri
     * @param {Object} paginationInfo - Sayfalandırma bilgisi
     * @param {string} message - Mesaj
     */
    static list(res, items, paginationInfo = null, message = 'Veriler başarıyla alındı') {
        const meta = paginationInfo ? {
            pagination: {
                total: paginationInfo.total,
                page: paginationInfo.page,
                perPage: paginationInfo.perPage,
                totalPages: Math.ceil(paginationInfo.total / paginationInfo.perPage),
                hasMore: paginationInfo.page < Math.ceil(paginationInfo.total / paginationInfo.perPage)
            }
        } : null;

        return this.success(res, 200, message, items, meta);
    }
}

module.exports = ApiResponse;