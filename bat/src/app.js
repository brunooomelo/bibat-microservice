const express = require("express");
const { Upload } = require("./config/multer");
const Bat = require("./models/bat");
const middle = require("./services/auth");
require("./config/database");
const app = express();

app.use(express.json());

app.get("/bat", middle, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const data = await Bat.paginate({
    page: parseInt(page),
    limit: parseInt(limit)
  });
  res.json({ bat: data });
});

app.get("/bat/:id", middle, async (req, res) => {
  const { id } = req.params;
  const data = await Bat.findOne({ _id: id });
  res.json({ user: data });
});

app.post("/bat", middle, Upload.single("file"), async (req, res) => {
  let data = new Bat({ ...req.body, file: { ...req.file }, star: 0 });
  res.json({ data: data.save() });
});

app.post("/bat/:id/star", middle, async (req, res) => {
  const { id } = req.params;
  let bat = await Bat.findOne({ _id: id });
  let data = await Bat.updateOne({ _id: id }, { star: bat.star + 1 });
  res.json({ data });
});

app.patch("/bat/:id", middle, async (req, res) => {
  const { id } = req.params;
  let data = await Bat.updateOne({ _id: id }, req.body);
  res.json({ data });
});

app.listen("3001", () => console.log("server listering in port 3001"));
