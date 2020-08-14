import Topic, { Keyword } from "../models/Topic";
import express, { Request, Response } from "express";
import { uploadFile, deleteFile } from "../middleware/fileManager";
const router = express.Router();

// @desc    Insert a new event topic.
// @route   POST /events/topics
router.post("/", async (req: Request, res: Response) => {
  try {
    console.log(req.body.keywords);
    const keywords = await Keyword.find().where("_id").in(req.body.keywords);
    const topic = await Topic.create({
      name: req.body.name,
      description: req.body.description,
      keywords: keywords,
    });
    res.send(topic);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// @desc    Get all event topics.
// @route   GET /events/topics
router.get("/", async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find().lean();
    res.send(topics);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

// @desc    Insert a new event topic keyword.
// @route   POST /events/topics/keywords
router.post("/keywords", uploadFile.single("svg"), async (req: Request, res: Response) => {
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

// @desc    Get all event topic keywords.
// @route   GET /events/topics/keywords
router.get("/keywords", async (req: Request, res: Response) => {
  try {
    const keywords = await Keyword.find().lean();
    res.send(keywords);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

module.exports = router;
