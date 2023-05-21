const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hallo baby toy server");
});

app.get("/allToys", async (req, res) => {
  res.send();
});

app.get("/allToys/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  res.send();
});

app.patch("/allToys/:id", async (req, res) => {
  const id = req.params.id;
  const updatedToy = req.body;
  const query = { _id: new ObjectId(id) };
  res.send();
});

app.listen(port, () => {
  console.log(`listening on prot ${port}`);
});
