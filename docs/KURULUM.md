# Kahra Studio Kurulum Rehberi

Bu rehber, Kahra Studio projesinin yerel geliştirme ortamına ve üretim ortamına kurulumu için kapsamlı talimatlar içermektedir.

## İçindekiler

1. [Gereksinimler](#gereksinimler)
2. [Yerel Geliştirme Ortamı](#yerel-geliştirme-ortamı)
3. [Üretim Ortamı](#üretim-ortamı)
4. [Veritabanı Kurulumu](#veritabanı-kurulumu)
5. [Ortam Değişkenleri](#ortam-değişkenleri)
6. [SSS](#sss)

## Gereksinimler

Kahra Studio'yu çalıştırmak için aşağıdaki yazılımların kurulu olması gerekmektedir:

- Node.js (sürüm 16.0.0 ve üzeri)
- npm (Node.js ile birlikte gelir) veya pnpm
- MySQL (sürüm 5.7 ve üzeri)
- Git

## Yerel Geliştirme Ortamı

### 1. Projeyi Klonlama

```bash
git clone https://github.com/kullanici/kahrastudio.git
cd kahrastudio
```

### 2. Backend (API) Kurulumu

```bash
# API dizinine geçiş yap
cd api

# Bağımlılıkları yükle
npm install

# Ortam değişkenleri dosyasını oluştur
cp .env.example .env

# .env dosyasını düzenle (veritabanı ayarları vb.)
# Tercih ettiğiniz metin editörü ile .env dosyasını açın

# Geliştirme sunucusunu başlat
npm run dev
```

API, varsayılan olarak http://localhost:5000 adresinde çalışacaktır.

### 3. Frontend (Studio) Kurulumu

```bash
# Ana dizine geri dön
cd ..

# Studio dizinine geç
cd studio

# Bağımlılıkları yükle
pnpm install  # veya npm install

# Ortam değişkenleri dosyasını oluştur
cp .env.example .env

# .env dosyasını düzenle
# Tercih ettiğiniz metin editörü ile .env dosyasını açın
# API_URL değişkenini doğru adrese ayarlayın (örn: VITE_API_URL=http://localhost:5000/api)

# Geliştirme sunucusunu başlat
pnpm run dev  # veya npm run dev
```

Frontend uygulaması varsayılan olarak http://localhost:5173 adresinde çalışacaktır.

## Veritabanı Kurulumu

### MySQL Veritabanı Oluşturma

```sql
CREATE DATABASE kahrastudio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kahrauser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON kahrastudio.* TO 'kahrauser'@'localhost';
FLUSH PRIVILEGES;
```

Bu komutları MySQL komut satırında veya MySQL Workbench gibi bir araçla çalıştırabilirsiniz.

### Veritabanı Yapılandırması

API'nin `.env` dosyasında aşağıdaki veritabanı yapılandırmalarını düzenleyin:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASS=password
DB_NAME=studio
```

## Üretim Ortamı

Kahra Studio'yu üretim ortamına dağıtmak için aşağıdaki adımları izleyin:

### 1. Frontend Build İşlemi

```bash
cd studio
pnpm install  # veya npm install
pnpm run build  # veya npm run build
```

Bu işlem `dist` klasöründe dağıtıma hazır dosyaları oluşturacaktır.

### 2. Backend Build İşlemi

```bash
cd api
npm install
```

### 3. PM2 ile Dağıtım (Önerilen)

PM2, Node.js uygulamalarını üretim ortamında çalıştırmak için kullanılan güçlü bir işlem yöneticisidir.

```bash
# PM2'yi global olarak yükle
npm install -g pm2

# API'yi başlat
cd api
NODE_ENV=production pm2 start src/server.js --name "kahra-api"

# PM2 yapılandırmasını kaydet
pm2 save

# Otomatik başlatmayı etkinleştir
pm2 startup
```

### 4. Frontend Dağıtımı

Frontend build dosyalarını (`studio/dist` klasörü) bir web sunucusuna (Nginx, Apache vb.) dağıtın.

#### Nginx Yapılandırma Örneği

```nginx
server {
    listen 80;
    server_name example.com;

    root /path/to/kahrastudio/studio/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Ortam Değişkenleri

### API Ortam Değişkenleri

```
# Uygulama Ayarları
APP_ENV=development # production için production
APP_PORT=5000
APP_HOST=localhost

# Veritabanı Ayarları
DB_HOST=localhost
DB_PORT=3306
DB_USER=kahrauser
DB_PASS=password
DB_NAME=kahrastudio

# JWT Ayarları
JWT_SECRET=super_gizli_anahtar
JWT_EXPIRES_IN=90d

# Redis Ayarları (isteğe bağlı)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Upload Ayarları
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880 # 5MB
```

### Frontend Ortam Değişkenleri

```
VITE_API_URL=http://localhost:5000/api
```

## SSS

### Uygulama çalıştığında bağlantı hatası alıyorum

1. API'nin çalışıp çalışmadığını kontrol edin: `http://localhost:5000/api/health`
2. Veritabanı bağlantı bilgilerinin doğru olduğundan emin olun
3. `.env` dosyasındaki değişkenlerin doğru ayarlandığından emin olun

### Frontend'de API'ye bağlanırken CORS hatası alıyorum

API'nin `app.js` dosyasında CORS yapılandırmasının doğru şekilde ayarlandığından emin olun:

```javascript
app.use(cors({
  origin: process.env.APP_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173'],
  credentials: true
}));
```

### Dosya yükleme sorunları yaşıyorum

1. `uploads` klasörünün var olduğundan ve yazılabilir olduğundan emin olun
2. `.env` dosyasında `UPLOAD_DIR` ve `MAX_FILE_SIZE` değişkenlerinin doğru ayarlandığından emin olun

### PM2 ile uygulamayı başlatırken hata alıyorum

1. Node.js sürümünüzün güncel olduğundan emin olun
2. `logs` klasörünün yazılabilir olduğundan emin olun
3. PM2 log dosyalarını kontrol edin: `pm2 logs kahra-api` 