# Kahra Studio API Dokümantasyonu

## Genel Bakış

Kahra Studio API, Node.js ve Express.js kullanılarak geliştirilmiş RESTful bir API'dir. Temel amacı, Kahra Studio frontend uygulamasına veri sağlamak ve işlemleri yönetmektir.

## Teknik Detaylar

- **Dil**: JavaScript (Node.js)
- **Framework**: Express.js
- **Veritabanı**: MySQL
- **Kimlik Doğrulama**: JWT (JSON Web Token)
- **Gerçek Zamanlı İletişim**: Socket.io
- **API Dokümantasyonu**: Swagger

## Kurulum

```bash
# Gerekli paketleri yükle
cd api
npm install

# Geliştirme modunda çalıştır
npm run dev

# Üretim modunda çalıştır
npm start
```

## Ortam Değişkenleri

API, `.env` dosyasında bulunan aşağıdaki değişkenleri kullanır:

```
APP_ENV=development
APP_PORT=5000
APP_HOST=localhost

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=kahrastudio

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Diğer gerekli çevre değişkenleri
```

## API Endpoint'leri

API'nin temel endpoint yapısı aşağıdaki gibidir:

### Kimlik Doğrulama

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/logout` - Kullanıcı çıkışı
- `GET /api/auth/me` - Mevcut kullanıcı bilgilerini getir
- `PUT /api/auth/update-profile` - Kullanıcı profilini güncelle
- `POST /api/auth/reset-password` - Şifre sıfırlama

### İçerik Yönetimi

- `GET /api/content` - Tüm içerikleri listele
- `GET /api/content/:id` - Belirli bir içeriği getir
- `POST /api/content` - Yeni içerik oluştur
- `PUT /api/content/:id` - İçeriği güncelle
- `DELETE /api/content/:id` - İçeriği sil

### Kullanıcı Yönetimi

- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/:id` - Belirli bir kullanıcıyı getir
- `PUT /api/users/:id` - Kullanıcıyı güncelle
- `DELETE /api/users/:id` - Kullanıcıyı sil

## Middleware Yapısı

API'nin middleware yapısı aşağıdaki gibidir:

- **auth.js**: JWT tabanlı kimlik doğrulama
- **errorHandler.js**: Hata yakalama ve işleme
- **validator.js**: İstek verilerini doğrulama
- **rateLimiter.js**: İstek sınırlama
- **logger.js**: İstek loglama

## Hata Yönetimi

API, HTTP durum kodları ve uygun hata mesajları ile tutarlı bir hata yapısı kullanır. Örnek hata yanıtı:

```json
{
  "status": "error",
  "message": "Kullanıcı bulunamadı",
  "code": 404,
  "data": null
}
```

## Güvenlik Önlemleri

API aşağıdaki güvenlik önlemlerini içerir:

- Helmet ile HTTP başlıklarının güvenliği
- Express-rate-limit ile hız sınırlama
- XSS koruması
- JWT ile güvenli kimlik doğrulama
- Hassas verilerin şifrelenmesi
- CORS yapılandırması

## Socket.io Entegrasyonu

API, gerçek zamanlı iletişim için Socket.io kullanır. Temel olaylar:

- `connection`: Kullanıcı bağlantısı
- `disconnect`: Kullanıcı bağlantı kesimi
- `message`: Mesaj alışverişi
- `notification`: Bildirimler

## Veritabanı Yapısı

API, MySQL veritabanı kullanır. Temel tablolar:

- `users`: Kullanıcı bilgileri
- `contents`: İçerik verileri
- `categories`: Kategori bilgileri
- `tags`: Etiket bilgileri
- `comments`: Yorum verileri

## Loglama

API, Winston kullanarak aşağıdaki log seviyelerini destekler:

- error: Hatalar
- warn: Uyarılar
- info: Bilgi mesajları
- debug: Hata ayıklama
- verbose: Ayrıntılı bilgi

Loglar `logs` klasöründe tarih bazlı olarak saklanır.

## Swagger Dokümantasyonu

API, `/api-docs` endpoint'inde Swagger UI aracılığıyla erişilebilen kapsamlı bir API dokümantasyonu sağlar. 