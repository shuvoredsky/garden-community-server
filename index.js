const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
z;

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
      const result = await gardenTipsCollection.find().toArray();
      res.send(result);
    });

    // GET route for checking
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
