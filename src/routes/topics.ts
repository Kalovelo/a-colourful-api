import Topic from "../models/Topic";
import Keyword, { KeywordDocument } from "../models/Keyword";
import express, { Request, Response } from "express";
import { uploadFile, deleteFile } from "../middleware/fileManager";
const router = express.Router();

/**
 * @api {post} /events/topics Create a topic
 * @apiGroup Topic
 * @apiParam (Topic) {String} name Topic's name
 * @apiParam (Topic) {String} description Topic's description
 * @apiParam (Topic) {[String]} keywords keyword ids
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const keywords = await Keyword.find()
      .where("_id")
      .in(req.body.keywords)
      .catch(() => {
        return null;
      });
    if (!keywords) return res.status(404).send("No keyword was found.");

    const topic = await Topic.create({
      name: req.body.name,
      description: req.body.description,
      keywords: keywords,
    });

    res.send(topic);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * @api {get} /events/topics Get ALL topics
 * @apiGroup Topic
 *
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find().lean();
    res.send(topics);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

/**
 * @api {put} /events/topics/:id Update topic
 * @apiGroup Topic
 * @apiParam (Topic) {String} id Topic ID
 * @apiParam (Topic) {String} name Topic name
 * @apiParam (Topic) {String} description Topic description
 * @apiParam (Topic) {[String]} keywords Array of Keyword ids
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const keywords = await Keyword.find()
      .where("_id")
      .in(req.body.keywords)
      .catch(() => {
        return null;
      });
    if (!keywords) return res.status(404).send("No keyword was found.");

    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        description: req.body.description,
        keywords: keywords,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!topic) {
      res.status(404);
      throw new Error("No Topic was found.");
    }
    res.send(topic);
  } catch (err) {
    console.log(err.name);
    if (res.statusCode === 200) res.status(400).send(err.message);
    else res.send(err.message);
  }
});

/**
 * @api {post} /events/topics/keywords Create topic keyword
 * @apiGroup Keyword
 * @apiParam (Keyword) {String} name Topic's name
 * @apiParam (Keyword) {SVG} svg keyword's svg logo
 */
router.post("/keywords", uploadFile.single("svg"), async (req: Request, res: Response) => {
  try {
    const keyword = await Keyword.create({
      name: req.body.name,
      svg: req.file?.path,
    });
    res.send(keyword);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * @api {get} /events/topics/keywords Get ALL topic keywords
 * @apiGroup Keyword
 */
router.get("/keywords", async (req: Request, res: Response) => {
  try {
    const keywords = await Keyword.find().lean();
    res.send(keywords);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

/**
 * @api {put} /events/topics/keywords/:id Update topic keyword
 * @apiGroup Keyword
 * @apiParam (Keyword) {String} id Keyword ID
 * @apiParam (Keyword) {String} name Keyword name
 * @apiParam (Keyword) {SVG} svg keyword's svg logo
 */
router.put("/keywords/:id", uploadFile.single("svg"), async (req: Request, res: Response) => {
  try {
    let data: { name?: string | null; svg?: String } = {
      name: req.body.name,
    };
    if (req.file) data.svg = req.file.path;
    let keyword = await Keyword.findOneAndUpdate({ _id: req.params.id }, data as KeywordDocument, {
      new: true,
      runValidators: true,
    });
    if (!keyword) throw new Error("Keyword ID not found.");
    res.send(keyword);
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

module.exports = router;
