import Keyword, { KeywordDocument } from "../models/Keyword";
import express, { Request, Response } from "express";
import { uploadFile } from "../middleware/fileManager";
const router = express.Router();

/**
 * @api {post} /events/topics/keywords Create topic keyword
 * @apiGroup Keyword
 * @apiParam (Keyword) {String} name Topic's name
 * @apiParam (Keyword) {SVG} svg keyword's svg logo
 */
router.post("/", uploadFile.single("svg"), async (req: Request, res: Response) => {
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
router.get("/", async (req: Request, res: Response) => {
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
router.put("/:id", uploadFile.single("svg"), async (req: Request, res: Response) => {
  try {
    let data: { name?: string | null; svg?: String } = {};
    if (req.body.name) data.name = req.body.name;
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

/**
 * @api {delete} /events/topics/keywords Delete topic keyword
 * @apiGroup Keyword
 * @apiParam (Keyword) {String} id Keyword ID
 */
router.delete("/", async (req: Request, res: Response) => {
  try {
    let keyword = await Keyword.findByIdAndDelete(req.body.id);
    if (!keyword) throw new Error("Keyword ID not found.");
    res.send(keyword);
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

module.exports = router;
