import Topic from "../models/Topic";
import Keyword, { KeywordDocument } from "../models/Keyword";
import express, { Request, Response } from "express";
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
    if (res.statusCode === 200) res.status(400).send(err.message);
    else res.send(err.message);
  }
});

/**
 * @api {delete} /events/topics Delete topic
 * @apiGroup Topic
 * @apiParam (Topic) {String} id Topic ID
 */
router.delete("/", async (req: Request, res: Response) => {
  try {
    let topic = await Topic.findByIdAndDelete(req.body.id);
    if (!topic) throw new Error("Topic ID not found.");
    res.send(topic);
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

module.exports = router;
