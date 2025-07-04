const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload"); // thư mục lưu file .xlsx
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".xls" && ext !== ".xlsx") {
    return cb(new Error("Chỉ chấp nhận file Excel (.xls, .xlsx)"));
  }
  cb(null, true);
};

const uploadExcel = multer({ storage, fileFilter });

module.exports = { uploadExcel };
