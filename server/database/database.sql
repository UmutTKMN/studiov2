-- Roles tablosu
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- Users tablosu
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(150) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_bio TEXT,
    user_role INT NOT NULL,
    user_profileImage VARCHAR(255),

    -- Eğitim Bilgileri
    user_university VARCHAR(150),
    user_department VARCHAR(150),
    user_graduationYear INT,
    user_degree VARCHAR(50),

    -- İş Bilgileri
    user_company VARCHAR(150),
    user_position VARCHAR(100),
    user_yearsOfExperience INT,
    user_currentlyWorking BOOLEAN DEFAULT FALSE,

    -- Sosyal Medya Bilgileri
    user_instagram VARCHAR(255),
    user_twitter VARCHAR(255),
    user_linkedin VARCHAR(255),
    user_github VARCHAR(255),

    -- Adres Bilgileri
    user_country VARCHAR(100),
    user_city VARCHAR(100),
    user_postalCode VARCHAR(20),

    -- Kullanıcı Tercihleri
    user_theme ENUM('light', 'dark') DEFAULT 'light',
    user_language VARCHAR(10) DEFAULT 'en',
    user_emailNotifications BOOLEAN DEFAULT TRUE,
    user_pushNotifications BOOLEAN DEFAULT TRUE,

    -- Hesap Durumu
    user_isActive BOOLEAN DEFAULT TRUE,
    user_isVerified BOOLEAN DEFAULT FALSE,
    user_lastLogin DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_role) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- Varsayılan rolleri ekle
INSERT INTO roles (role_name, role_description) VALUES 
('admin', 'Sistem yöneticisi'),
('user', 'Normal kullanıcı'),
('moderator', 'İçerik moderatörü');
