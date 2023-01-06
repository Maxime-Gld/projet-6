const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, files, callback) => {
        callback(null, 'images')
    },
    filename: (req, files, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[files.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');