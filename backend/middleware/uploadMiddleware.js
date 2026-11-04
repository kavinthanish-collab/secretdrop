
const multer = require("multer");
const path = require("path");

// Upload folder
const uploadPath = path.join(__dirname, "../uploads");

// Image storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

// Allow images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;
