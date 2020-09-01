import multer from "multer";
import fs from "fs";
import createHttpError from "http-errors";
import GraphqlHTTPError from "../utils/GraphqlHTTPError";

const SUPPORTED_MIMETYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/web"];

const _getUploadDir = (mimetype: string) => {
  if (!SUPPORTED_MIMETYPES.includes(mimetype)) {
    const error = new GraphqlHTTPError("Filetype is not supported.", 415);
    throw error;
  }
  return mimetype === "image/svg+xml" ? "./src/uploads/svg" : "./src/uploads/images";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, _getUploadDir(file.mimetype));
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

export const uploadFileGraphQL = (stream: any, filename: String, mimetype: string) => {
  let uploadDir = _getUploadDir(mimetype);
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on("error", (error: any) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", (error: any) => reject(error))
      .on("finish", () => resolve(path))
  );
};

export const deleteFile = (path: string) =>
  fs.unlink(path, (error) => {
    if (error) {
      console.error(error);
      return;
    }
  });
