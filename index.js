const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hallo baby toy server");
});

// const page = parseInt(req.query.page) || 0;
// const limit = parseInt(req.query.limit) || 10;
// const skip = page * limit;

// const result = await productCollection.find().skip(skip).limit(limit).toArray();
// res.send(result);

const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;

const uri = `mongodb+srv://${db_user}:${db_pass}@cluster0.jmqwkqq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // client.connect();

    const database = client.db("ToyGalaxy");
    const products = database.collection("products");

    app.get("/allToys", async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      // const limit = parseInt(req.query.limit) || 10;
      const limit = 20;
      const skip = page * limit;
      const query = req.query.toy_name
        ? {
            toy_name: { $regex: new RegExp(req.query.toy_name, "i") },
          }
        : {};
      const result = await products
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send(result);

      // const result = await products.find().toArray();
      // res.send(result);
    });
    app.post("/allToys", async (req, res) => {
      const newToy = req.body;
      const result = await products.insertOne(newToy);
      res.send(result);
    });

    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    });

    app.get("/myToys", async (req, res) => {
      const queryUrl = req.query;
      const query = {
        seller_email: { $regex: new RegExp(queryUrl.seller_email, "i") },
      };
      const result = await products.find(query).limit(20).toArray();
      res.send(result);
    });

    app.put("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const updatedToy = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await products.updateOne(query, { $set: updatedToy });
      res.send(result);
    });

    app.get("/getByCategory", async (req, res) => {
      const queryUrl = req.query;
      const query = {
        sub_category: { $regex: new RegExp(queryUrl.sub_category, "i") },
      };
      const result = await products.find(query).limit(20).toArray();
      res.send(result);
    });

    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`listening on prot ${port}`);
});
