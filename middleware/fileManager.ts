import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filetype = file.mimetype;
    filetype.includes("svg") ? cb(null, "./uploads/svg/") : cb(null, "./uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const uploadFile = multer({ storage: storage });

export const deleteFile = (path: string) =>
  fs.unlink(path, (error) => {
    if (error) {
      console.error(error);
      return;
    }
  });
