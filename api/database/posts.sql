CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    post_title VARCHAR(255) NOT NULL,
    post_slug VARCHAR(255) UNIQUE NOT NULL,
    post_excerpt TEXT,
    post_content TEXT NOT NULL,
    post_author INT NOT NULL,
    post_category INT,  -- NULL olabilir çünkü kategori silinirse etkilenmemeli
    post_tags VARCHAR(255),
    post_likes INT DEFAULT 0,
    post_comments INT DEFAULT 0,
    post_views INT DEFAULT 0,
    post_image VARCHAR(255),
    post_status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    post_createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    post_updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_author) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_category) REFERENCES categories(category_id) ON DELETE SET NULL
);