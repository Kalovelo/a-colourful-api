import fs from "fs";
import sharp from "sharp";
import { Stream } from "stream";
import GraphqlHTTPError from "../utils/GraphqlHTTPError";

const SUPPORTED_MIMETYPES = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/web",
};

const MAX_IMAGE_WIDTH = 1300;

const _getUploadDir = (mimetype: string) => {
  if (!Object.values(SUPPORTED_MIMETYPES).includes(mimetype)) {
    const error = new GraphqlHTTPError("Filetype is not supported.", 415);
    throw error;
  }
  return mimetype === SUPPORTED_MIMETYPES.svg ? "src/uploads/svg" : "src/uploads/images";
};

const _splitFilename = (filename: string) => {
  var name = filename.substring(0, filename.lastIndexOf(".") + 1);
  var extension = filename.substring(filename.lastIndexOf("/") + 1, filename.length);
  return { name, extension };
};

const _uploadFileGraphQL = (stream: any, filename: String, mimetype: string) => {
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

export const bulkUpload = async (images: any) => {
  return await Promise.all(images.map(async (image: any) => await uploadFile(image)));
};

export const bulkDelete = async (files: string[]) => {
  return await Promise.all(files.map(async (file: string) => deleteFile(file)));
};

const _minify = async (rawUploadPath: string, filename: string, mimetype: string) => {
  console.log(rawUploadPath);
  const sharped = sharp(rawUploadPath);
  const metadata = await sharped.metadata();
  if (metadata.width && metadata!.width > MAX_IMAGE_WIDTH) {
    let uploadDir = _getUploadDir(mimetype);
    const { name, extension } = _splitFilename(filename);
    const path = `${uploadDir}/${name}--minified.${extension}`;
    await sharped.resize(Math.round(MAX_IMAGE_WIDTH)).jpeg().toFile(path);
    await deleteFile(rawUploadPath);
    return await path;
  } else return rawUploadPath;
};

export const uploadFile = async (file: any) => {
  const { filename, mimetype, encoding, createReadStream } = await file;
  const stream: Stream = createReadStream();
  const rawUploadPath = (await _uploadFileGraphQL(stream, filename, mimetype)) as string;
  return mimetype !== SUPPORTED_MIMETYPES.svg
    ? await _minify(rawUploadPath, filename, mimetype)
    : rawUploadPath;
};
