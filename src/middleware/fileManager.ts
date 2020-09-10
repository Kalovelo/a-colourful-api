import fs from "fs";
import GraphqlHTTPError from "../utils/GraphqlHTTPError";

const SUPPORTED_MIMETYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/web"];

const _getUploadDir = (mimetype: string) => {
  if (!SUPPORTED_MIMETYPES.includes(mimetype)) {
    const error = new GraphqlHTTPError("Filetype is not supported.", 415);
    throw error;
  }
  return mimetype === "image/svg+xml" ? "src/uploads/svg" : "src/uploads/images";
};
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

export const bulkUpload = async (images: any) => {
  return await Promise.all(images.map(async (image: any) => (await uploadFile(image)) as string));
};

export const bulkDelete = async (files: string[]) => {
  return await Promise.all(files.map(async (file: string) => deleteFile(file)));
};

export const uploadFile = async (file: any) => {
  const { filename, mimetype, encoding, createReadStream } = await file;
  const stream = createReadStream();
  return (await uploadFileGraphQL(stream, filename, mimetype)) as string;
};
