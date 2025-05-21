const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://garden-community:Mr6P0UfLa5rwSr6r@cluster0.fnfwwoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected!");

    const gardenTipsCollection = client.db("tipsDB").collection("tips");

    // POST route to receive tips from client
    app.post("/gardener", async (req, res) => {
      const newtip = req.body;
      console.log("Received tip:", newtip);
      const result = await gardenTipsCollection.insertOne(newtip);
      res.send(result);
    });

    app.get("/gardener", async (req, res) => {
      const result = await gardenTipsCollection.find().limit(6).toArray();
      res.send(result);
    });

    app.get("/gardener/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gardenTipsCollection.findOne(query);
      res.send(result);
    });

    app.put("/gardener/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateMyTips = req.body;
      const updateDoc = {
        $set: updateMyTips,
      };
      const result = await gardenTipsCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.delete("/gardener/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gardenTipsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/", (req, res) => {
      res.send("Garden server is running!");
    });
  } catch (err) {
    console.error("Connection error:", err);
  }
}

run();

app.listen(port, () => {
  console.log(`Garden server is running on port ${port}`);
});
