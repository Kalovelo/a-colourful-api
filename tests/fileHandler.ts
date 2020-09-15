import fs from "fs";
import path from "path";

const UPLOAD_FOLDERS = ["src/uploads/svg", "src/uploads/images"];

export const emptyUploadFolders = () => {
  UPLOAD_FOLDERS.forEach((folder) => {
    fs.readdir(folder, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(folder, file), (err) => {
          if (err) throw err;
        });
      }
    });
  });
};
