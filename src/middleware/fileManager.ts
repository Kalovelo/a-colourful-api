import multer from "multer";
import fs from "fs";
import createHttpError from "http-errors";

const SUPPORTED_MIMETYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/web"];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filetype = file.mimetype;
    filetype === "image/svg+xml" ? cb(null, "./src/uploads/svg/") : cb(null, "./uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const uploadFile = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!SUPPORTED_MIMETYPES.includes(file.mimetype)) {
      const error = createHttpError("Filetype is not supported.");
      error.name = "Invalid filetype";
      error.status = 415;
      cb(error);
    }
    cb(null, true);
  },
});

export const deleteFile = (path: string) =>
  fs.unlink(path, (error) => {
    if (error) {
      console.error(error);
      return;
    }
  });
