const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { ErrorHandler } = require('./error');
const logger = require('../utils/logger');

// Upload klasörünü oluştur
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Dosya türüne göre klasörler
        let folder = 'misc';
        if (file.mimetype.startsWith('image/')) {
            folder = 'images';
        } else if (file.mimetype.startsWith('video/')) {
            folder = 'videos';
        } else if (file.mimetype.startsWith('audio/')) {
            folder = 'audio';
        }

        const targetDir = path.join(uploadDir, folder);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        // Dosya adını güvenli hale getir
        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    // İzin verilen dosya türleri
    const allowedTypes = {
        'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        'video': ['video/mp4', 'video/webm'],
        'audio': ['audio/mp3', 'audio/wav', 'audio/mpeg'],
        'document': ['application/pdf']
    };
    
    // Dosya türünü kontrol et
    let isAllowed = false;
    for (const type in allowedTypes) {
        if (allowedTypes[type].includes(file.mimetype)) {
            isAllowed = true;
            break;
        }
    }
    
    if (!isAllowed) {
        return cb(new ErrorHandler('Geçersiz dosya türü. Sadece JPEG, PNG, GIF, WebP, MP4, WebM, MP3, WAV ve PDF dosyaları yüklenebilir.', 400), false);
    }
    
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 5 // Maksimum 5 dosya
    }
});

// Hata yönetimi eklenmiş multer
const uploadMiddleware = (field, options = {}) => {
    const uploadHandler = options.multiple 
        ? upload.array(field, options.maxFiles || 5)
        : upload.single(field);
        
    return (req, res, next) => {
        uploadHandler(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({
                            success: false,
                            message: 'Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.'
                        });
                    }
                    if (err.code === 'LIMIT_FILE_COUNT') {
                        return res.status(400).json({
                            success: false,
                            message: 'Çok fazla dosya yüklemeye çalıştınız.'
                        });
                    }
                }
                
                logger.error(`Dosya yükleme hatası: ${err.message}`);
                return res.status(err.statusCode || 400).json({
                    success: false,
                    message: err.message || 'Dosya yükleme hatası'
                });
            }
            next();
        });
    };
};

module.exports = {
    upload,
    uploadMiddleware
};