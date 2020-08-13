import Topic, { Keyword } from "../models/Topic";
import express, { Request, Response } from "express";
import { uploadFile, deleteFile } from "../middleware/fileManager";
const router = express.Router();

// @desc    Insert a new event topic keyword.
// @route   POST /events/topics/keywords
router.post("/topics/keywords", uploadFile.single("svg"), async (req: Request, res: Response) => {
  try {
    const keyword = await Keyword.create({
      name: req.body.name,
      svg: req.file.path,
    });
    res.send(keyword);
  } catch (err) {
    deleteFile(req.file.path); //Delete file if error
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
