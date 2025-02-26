import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 saniye
});

// Güvenlik yardımcı fonksiyonları
const security = {
  // XSS koruması için veri temizliği
  sanitizeData: (data) => {
    if (!data || typeof data !== 'object') return data;
    
    const sanitized = { ...data };
    
    // Temel metin temizleme fonksiyonu
    const sanitizeText = (text) => {
      if (typeof text !== 'string') return text;
      return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };
    
    // Obje içindeki tüm string değerleri temizle
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitizeText(sanitized[key]);
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = security.sanitizeData(sanitized[key]);
      }
    });
    
    return sanitized;
  },
  
  // FormData oluşturma ve güvenli hale getirme
  createFormData: (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      // Dosya veya dosya dizisi kontrolü
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (Array.isArray(data[key]) && data[key][0] instanceof File) {
        data[key].forEach(file => {
          formData.append(key, file);
        });
      } 
      // Nesne kontrolü
      else if (typeof data[key] === 'object' && data[key] !== null) {
        formData.append(key, JSON.stringify(security.sanitizeData(data[key])));
      } 
      // Diğer veri türleri
      else {
        formData.append(key, typeof data[key] === 'string' ? 
          security.sanitizeData(data[key]) : data[key]);
      }
    });
    
    return formData;
  }
};

// İstek interceptor'u
api.interceptors.request.use(
  (config) => {
    // CSRF token kontrolü
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    
    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    // Token kontrolü
    try {
      const authDataStr = localStorage.getItem("authData");
      if (!authDataStr) return config;
      
      const authData = JSON.parse(authDataStr);
      if (!authData?.token) return config;
      
      // Token geçerlilik kontrolü
      const decodedToken = jwtDecode(authData.token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        // Token süresi dolmuş, response interceptor'da yenilenecek
        return config;
      }
      
      // Token geçerliyse ekle
      config.headers.Authorization = `Bearer ${authData.token}`;
    } catch (error) {
      console.error("Token işleme hatası:", error);
      localStorage.removeItem("authData");
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Yanıt interceptor'u
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Ağ hatası kontrolü
    if (!error.response) {
      console.error("Ağ hatası:", error);
      return Promise.reject(new Error("Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin."));
    }

    // Token yenileme kontrolü (401 hatası)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Yenileme token kontrolü
        const authDataStr = localStorage.getItem("authData");
        if (!authDataStr) {
          throw new Error("Kimlik bilgileri bulunamadı");
        }

        const authData = JSON.parse(authDataStr);
        const refreshToken = authData?.refreshToken;
        
        if (!refreshToken) {
          throw new Error("Yenileme token'ı bulunamadı");
        }

        // Yeni token isteği - interceptor döngüsünü önlemek için axios kullanılıyor
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken },
          { 
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
          }
        );

        if (response.data.success && response.data.token) {
          // Yeni token kaydı
          const newAuthData = {
            ...authData,
            token: response.data.token,
            refreshToken: response.data.refreshToken || authData.refreshToken
          };
          
          localStorage.setItem("authData", JSON.stringify(newAuthData));
          
          // İsteği yeni token ile tekrarla
          originalRequest.headers["Authorization"] = `Bearer ${response.data.token}`;
          return api(originalRequest);
        } else {
          throw new Error("Token yenileme başarısız");
        }
      } catch (refreshError) {
        console.error("Token yenileme hatası:", refreshError);
        localStorage.removeItem("authData");
        window.location.href = "/admin/login?sessionExpired=true";
        return Promise.reject(new Error("Oturum süresi doldu. Lütfen tekrar giriş yapın."));
      }
    }
    
    // Diğer hata durumları
    if (error.response?.status === 403) {
      console.error("Yetki hatası:", error.response.data.message || "Bu işlem için yetkiniz yok");
    }
    
    if (error.response?.status === 429) {
      console.error("Rate limit hatası:", error.response.data.message || "Lütfen daha sonra tekrar deneyin");
    }

    return Promise.reject(error);
  }
);

// Güvenlik kontrolleri API'ye ekle
api.security = security;

export default api;
