CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    category_description TEXT,
    category_createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    category_updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Örnek kategoriler
INSERT INTO categories (category_name, category_description) VALUES 
('Genel', 'Genel kategoriler'),
('Teknoloji', 'Teknoloji ile ilgili konular'),
('Yazılım', 'Yazılım geliştirme ile ilgili konular');
