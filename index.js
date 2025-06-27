const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fnfwwoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    console.log("MongoDB connected!");

    const gardenTipsCollection = client.db("tipsDB").collection("tips");

    app.post("/gardener", async (req, res) => {
      const newtip = req.body;

      const result = await gardenTipsCollection.insertOne(newtip);
      res.send(result);
    });

    // app.get("/gardener", async (req, res) => {
    //   const result = await gardenTipsCollection.find().toArray();
    //   res.send(result);
    // });

    app.get("/gardener", async (req, res) => {
      try {
        const { difficulty } = req.query;
        const filter = {};

        if (difficulty) {
          filter.difficulty = { $regex: new RegExp(`^${difficulty}$`, "i") };
        }

        const result = await gardenTipsCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching tips:", error);
        res.status(500).send({ error: "Failed to fetch tips" });
      }
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

    app.patch("/gardener/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: req.body };

        const result = await gardenTipsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("PATCH error:", error);
        res.status(500).send({ error: "Failed to update gardener info" });
      }
    });

    app.get("/my-items/:email", async (req, res) => {
      const email = req.params.email;

      const filter = { userEmail: email };
      const items = await gardenTipsCollection.find(filter).toArray();
      res.send(items);
    });

    app.delete("/gardener/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gardenTipsCollection.deleteOne(query);
      res.send(result);
    });
  } catch (err) {
    console.error("Connection error:", err);
  }
}

run().catch((error) => {
  console.log(error);
});

app.get("/", (req, res) => {
  res.send("Garden server is running!");
});

app.listen(port, () => {
  console.log(`Garden server is running on port ${port}`);
});
