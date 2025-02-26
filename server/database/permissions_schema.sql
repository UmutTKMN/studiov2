-- Staff Rolleri Tablosu
CREATE TABLE IF NOT EXISTS staff_roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- İzinler Tablosu
CREATE TABLE IF NOT EXISTS permissions (
  permission_id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff Tablosu (Kullanıcıların personel olarak atanması için)
CREATE TABLE IF NOT EXISTS staff (
  staff_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  title VARCHAR(100),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (role_id) REFERENCES staff_roles(role_id),
  UNIQUE (user_id) -- Bir kullanıcı sadece bir staff kaydına sahip olabilir
);

-- Rol İzinleri Tablosu (Hangi rolün hangi izinlere sahip olduğu)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES staff_roles(role_id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

-- Staff Özel İzinleri Tablosu (Personele özel olarak verilen izinler)
CREATE TABLE IF NOT EXISTS staff_permissions (
  staff_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (staff_id, permission_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

-- Temel rolleri ekleyelim
INSERT INTO staff_roles (name, description) VALUES
('Admin', 'Sistemin tüm özelliklerine erişim sağlayan admin rolü'),
('Manager', 'Proje ve içerik yönetiminden sorumlu rol'),
('Support Manager', 'Kullanıcı destek ve yardım işlemlerinden sorumlu rol');

-- Temel izinleri ekleyelim
INSERT INTO permissions (code, name, description) VALUES
-- Admin İzinleri
('ADMIN_ACCESS', 'Admin Paneline Erişim', 'Admin paneline erişim izni'),
('MANAGE_USERS', 'Kullanıcı Yönetimi', 'Kullanıcıları görüntüleme, düzenleme ve silme izni'),
('MANAGE_STAFF', 'Personel Yönetimi', 'Personel ekleyebilme ve düzenleyebilme izni'),
('MANAGE_ROLES', 'Rol Yönetimi', 'Rol oluşturma, düzenleme ve silme izni'),
('MANAGE_PERMISSIONS', 'İzin Yönetimi', 'İzin atama ve kaldırma izni'),
('VIEW_LOGS', 'Log Kayıtlarını Görüntüleme', 'Sistem log kayıtlarını görüntüleme izni'),

-- Manager İzinleri
('MANAGE_PROJECTS', 'Proje Yönetimi', 'Projeleri yönetme izni'),
('MANAGE_POSTS', 'İçerik Yönetimi', 'İçerikleri yönetme izni'),
('MODERATE_COMMENTS', 'Yorum Yönetimi', 'Yorumları düzenleme ve silme izni'),
('VIEW_STATISTICS', 'İstatistikleri Görüntüleme', 'Site istatistiklerini görüntüleme izni'),

-- Support Manager İzinleri
('MANAGE_TICKETS', 'Destek Talepleri Yönetimi', 'Destek taleplerini yönetme izni'),
('CONTACT_USERS', 'Kullanıcı İletişimi', 'Kullanıcılara mesaj gönderme izni'),
('VIEW_USER_DETAILS', 'Kullanıcı Detaylarını Görüntüleme', 'Kullanıcı hesap detaylarını görüntüleme izni');

-- Rollere izinleri atayalım
-- Admin rolüne tüm izinleri ata
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, permission_id FROM permissions;

-- Manager rolüne izinleri ata
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, permission_id FROM permissions WHERE code IN (
  'ADMIN_ACCESS', 'VIEW_STATISTICS', 'MANAGE_PROJECTS', 
  'MANAGE_POSTS', 'MODERATE_COMMENTS'
);

-- Support Manager rolüne izinleri ata
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, permission_id FROM permissions WHERE code IN (
  'ADMIN_ACCESS', 'MANAGE_TICKETS', 'CONTACT_USERS', 
  'VIEW_USER_DETAILS', 'MODERATE_COMMENTS'
);
