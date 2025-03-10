import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Đường dẫn để lưu tệp Excel
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /xlsx|xls/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb('Error: File type not supported', false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
