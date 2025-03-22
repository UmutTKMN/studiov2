# Kahra Studio Dokümantasyonu

Bu dokümantasyon, Kahra Studio projesinin teknik detaylarını ve kullanım talimatlarını içermektedir.

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Başlangıç](#başlangıç)
3. [Proje Yapısı](#proje-yapısı)
4. [Teknik Dokümantasyon](#teknik-dokümantasyon)
5. [Katkıda Bulunma](#katkıda-bulunma)
6. [Lisans](#lisans)

## Genel Bakış

Kahra Studio, içerik yönetimi ve stüdyo işlemleri için geliştirilmiş modern bir web uygulamasıdır. Bu proje, React tabanlı bir frontend ve Node.js tabanlı bir backend API'den oluşmaktadır.

### Temel Özellikler

- Kullanıcı kimlik doğrulama ve yetkilendirme
- İçerik oluşturma ve düzenleme
- Zengin metin editörü
- Gerçek zamanlı bildirimler
- Kullanıcı yönetimi
- Responsive tasarım

## Başlangıç

Projeyi yerel geliştirme ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### Gereksinimler

- Node.js (>= 16.0.0)
- npm veya pnpm
- MySQL veritabanı

### Kurulum

1. Repo'yu klonlayın:
   ```bash
   git clone https://github.com/kullanici/kahrastudio.git
   cd kahrastudio
   ```

2. Backend API'yi kurun:
   ```bash
   cd api
   npm install
   cp .env.example .env  # .env dosyasını yapılandırın
   npm run dev
   ```

3. Frontend uygulamasını kurun:
   ```bash
   cd ../studio
   pnpm install
   cp .env.example .env  # .env dosyasını yapılandırın
   pnpm run dev
   ```

4. Tarayıcınızda aşağıdaki adreslere giderek uygulamaya erişin:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Dokümantasyonu: http://localhost:5000/api-docs

## Proje Yapısı

Projemiz iki ana bölümden oluşmaktadır:

1. **API** - Backend Uygulaması
   - Node.js ve Express.js ile geliştirilmiş
   - RESTful API tasarımı
   - MySQL veritabanı entegrasyonu
   - JWT tabanlı kimlik doğrulama
   - Socket.io ile gerçek zamanlı özellikler

2. **Studio** - Frontend Uygulaması
   - React 19 ile geliştirilmiş
   - Tailwind CSS ile stillendirilmiş
   - React Router v7 ile sayfa yönlendirme
   - Editor.js ile zengin metin düzenleme
   - Responsive tasarım

## Teknik Dokümantasyon

Daha detaylı teknik dokümantasyon aşağıdaki bağlantılarda bulunabilir:

- [API Dokümantasyonu](docs/API.md)
- [Frontend Dokümantasyonu](docs/STUDIO.md)

## Katkıda Bulunma

Projeye katkıda bulunmak istiyorsanız, lütfen aşağıdaki adımları izleyin:

1. Projeyi forklayın
2. Yaptığınız değişiklikler için bir branch oluşturun (`git checkout -b ozellik/amazing-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Amazing özellik ekle'`)
4. Branch'inizi push edin (`git push origin ozellik/amazing-ozellik`)
5. Bir Pull Request açın

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. 