# Kahra Studio Frontend Dokümantasyonu

## Genel Bakış

Kahra Studio Frontend, React ve Tailwind CSS kullanılarak geliştirilmiş modern bir web uygulamasıdır. Vite build aracı ile yapılandırılmış ve en son React sürümünü (React 19) kullanır.

## Teknik Detaylar

- **Dil**: JavaScript/JSX
- **Framework**: React 19
- **Stil Kütüphanesi**: Tailwind CSS 4
- **UI Kütüphaneleri**: Ant Design, Material Tailwind
- **Build Aracı**: Vite 6
- **Paket Yöneticisi**: pnpm
- **Yönlendirme**: React Router v7
- **Editör**: Editor.js

## Kurulum

```bash
# Gerekli paketleri yükle
cd studio
pnpm install

# Geliştirme modunda çalıştır
pnpm run dev

# Üretim için build al
pnpm run build

# Önizleme
pnpm run preview
```

## Ortam Değişkenleri

Frontend, `.env` dosyasında bulunan aşağıdaki değişkenleri kullanır:

```
VITE_API_URL=http://localhost:5000/api
```

## Proje Yapısı

Studio projesinin klasör yapısı:

```
studio/
├── public/            # Statik dosyalar
├── src/               # Kaynak kodları
│   ├── admin/         # Admin paneli bileşenleri
│   ├── components/    # Yeniden kullanılabilir bileşenler
│   ├── context/       # React context yapıları
│   ├── layout/        # Sayfa layout bileşenleri
│   ├── pages/         # Sayfa bileşenleri
│   ├── routers/       # Yönlendirme yapılandırması
│   ├── services/      # API hizmet entegrasyonları
│   └── styles/        # CSS ve stil dosyaları
├── index.html         # Ana HTML dosyası
├── vite.config.js     # Vite yapılandırması
├── package.json       # Paket bağımlılıkları
└── .env               # Ortam değişkenleri
```

## Bileşenler

Frontend projesinde kullanılan temel bileşenler:

### Ana Bileşenler

- **Layout**: Sayfaların temel düzenini sağlar
- **Navbar**: Üst gezinme çubuğu
- **Sidebar**: Yan gezinme menüsü
- **Footer**: Alt bilgi bölümü

### Ortak Bileşenler

- **Button**: Özelleştirilmiş buton bileşeni
- **Card**: İçerik kartı bileşeni
- **Modal**: Modal pencere bileşeni
- **Toast**: Bildirim bileşeni
- **Form**: Form bileşenleri
- **Editor**: Zengin metin editörü

## Sayfalar

Frontend projesindeki temel sayfalar:

- **Ana Sayfa**: Kullanıcı karşılama sayfası
- **Giriş**: Kullanıcı girişi
- **Kayıt**: Yeni kullanıcı kaydı
- **Dashboard**: Kullanıcı kontrol paneli
- **İçerik Yönetimi**: İçerikleri düzenleme ve görüntüleme
- **Profil**: Kullanıcı profil yönetimi
- **Ayarlar**: Uygulama ayarları

## Kimlik Doğrulama

Uygulama, JWT tabanlı kimlik doğrulama kullanır. `AuthContext` ile kimlik doğrulama durumu yönetilir:

```jsx
import { createContext, useState, useEffect } from 'react';
import { login, logout, getMe } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kullanıcı bilgilerini al
  // Token yönetimi
  // Giriş/çıkış fonksiyonları

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## API Entegrasyonu

Uygulama, axios kütüphanesi ile backend API'sine bağlanır:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek önleyici
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Yanıt önleyici
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Hata işleme
    return Promise.reject(error);
  }
);

export default api;
```

## Yönlendirme

React Router v7 kullanarak yönlendirme yapılandırması:

```jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { 
        path: 'dashboard', 
        element: <PrivateRoute><DashboardPage /></PrivateRoute> 
      },
      { 
        path: 'profile', 
        element: <PrivateRoute><ProfilePage /></PrivateRoute> 
      },
      { 
        path: 'settings', 
        element: <PrivateRoute><SettingsPage /></PrivateRoute> 
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);
```

## Stillendirme

Proje, stil özelleştirmesi için Tailwind CSS kullanır. Temel konfigürasyon:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        accent: '#9b59b6',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#1abc9c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

## Editor.js Entegrasyonu

Editor.js kullanarak zengin metin düzenleme:

```jsx
import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Image from '@editorjs/image';
import Embed from '@editorjs/embed';

const RichTextEditor = ({ data, onChange }) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!instanceRef.current) {
      instanceRef.current = new EditorJS({
        holder: editorRef.current,
        tools: {
          header: Header,
          list: List,
          checklist: Checklist,
          quote: Quote,
          image: Image,
          embed: Embed,
        },
        data: data || {},
        onChange: async () => {
          const content = await instanceRef.current.save();
          onChange(content);
        },
      });
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return <div ref={editorRef} className="border border-gray-300 min-h-[300px] rounded-md p-4" />;
};

export default RichTextEditor;
```

## Üretim Optimizasyonu

- **Code Splitting**: React Router ile otomatik code splitting
- **Vite Optimizasyonu**: Hızlı derleme ve canlı yenileme
- **Lazy Loading**: Bileşenlerin gecikmeli yüklenmesi
- **Önbellek Stratejileri**: HTTP önbelleği ve yerel depolama

## Dağıtım

Projeyi dağıtmak için:

```bash
# Üretim için build
pnpm run build

# dist klasöründeki dosyaları sunucuya yükle
```

İdeal dağıtım ortamları:
- Vercel
- Netlify
- AWS Amplify
- GitHub Pages
- Docker konteyneri 