/**
 * Tarihi formatlar
 * @param {string|Date} date - Formatlanacak tarih
 * @param {string} locale - Kullanılacak dil (varsayılan: 'tr-TR')
 * @returns {string} Formatlanmış tarih
 */
export const formatDate = (date, locale = 'tr-TR') => {
  if (!date) return 'Belirtilmemiş';
  
  try {
    const dateObj = new Date(date);
    
    // Geçersiz tarih kontrolü
    if (isNaN(dateObj.getTime())) {
      return 'Geçersiz Tarih';
    }

    // Şimdi ile karşılaştırma
    const now = new Date();
    const diff = now - dateObj;
    const diffMinutes = Math.floor(diff / 60000);
    const diffHours = Math.floor(diff / 3600000);
    const diffDays = Math.floor(diff / 86400000);

    // Son 24 saat içindeyse
    if (diffMinutes < 60) {
      return `${diffMinutes} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    }

    // Standart tarih formatı
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Tarih formatlanırken hata:', error);
    return 'Hatalı Tarih';
  }
};

/**
 * Tarihi kısa formatta formatlar
 * @param {string|Date} date - Formatlanacak tarih
 * @param {string} locale - Kullanılacak dil (varsayılan: 'tr-TR')
 * @returns {string} Formatlanmış tarih
 */
export const formatShortDate = (date, locale = 'tr-TR') => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Tarih formatlanırken hata:', error);
    return '-';
  }
};

/**
 * İki tarih arasındaki farkı hesaplar
 * @param {string|Date} date1 - İlk tarih
 * @param {string|Date} date2 - İkinci tarih
 * @returns {string} Tarihler arası fark
 */
export const getDateDifference = (date1, date2) => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2 - d1);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return 'Bugün';
    if (days === 1) return 'Dün';
    if (days < 7) return `${days} gün önce`;
    if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
    if (days < 365) return `${Math.floor(days / 30)} ay önce`;
    return `${Math.floor(days / 365)} yıl önce`;
  } catch (error) {
    console.error('Tarih farkı hesaplanırken hata:', error);
    return '-';
  }
};

/**
 * Tarihi ISO formatına çevirir
 * @param {string|Date} date - Formatlanacak tarih
 * @returns {string} ISO formatında tarih
 */
export const toISODate = (date) => {
  try {
    return new Date(date).toISOString();
  } catch (error) {
    console.error('ISO tarih dönüşümünde hata:', error);
    return null;
  }
};

/**
 * Geçerli bir tarih olup olmadığını kontrol eder
 * @param {string|Date} date - Kontrol edilecek tarih
 * @returns {boolean} Tarih geçerli mi?
 */
export const isValidDate = (date) => {
  try {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
};
