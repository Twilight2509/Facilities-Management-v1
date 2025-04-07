import multer from 'multer';
import path from 'path';

// Lưu file Excel vào thư mục uploads/
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục lưu file Excel
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const excelFilter = (req, file, cb) => {
  const fileTypes = /xlsx|xls/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Error: Only Excel files are allowed'), false);
  }
};

// Lưu ảnh vào RAM để convert sang base64
const imageStorage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValid = allowedTypes.test(file.mimetype.toLowerCase());
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Error: Only image files (jpeg, jpg, png, gif) are allowed'), false);
  }
};

// Export 2 loại upload tương ứng
const uploadExcel = multer({ storage: excelStorage, fileFilter: excelFilter });
const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter });

export { uploadExcel, uploadImage };
