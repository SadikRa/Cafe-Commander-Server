const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DBNAME}:${process.env.DBPASS}@cluster0.ywq3nhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb+srv://${process.env.SECRET_KEY_NAME}:${process.env.SECRET_KEY_PASSWORD}@cluster0.ywq3nhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDB() {
  try {
    // Connect the client to the server
    await client.connect();

    const cafeCollection = client.db("CafeUser").collection("users");
    const cafeMenu = client.db("CafeUser").collection("menu");
    const cafeReviews = client.db("CafeUser").collection("reviews");
    const cafeCart = client.db("CafeUser").collection("carts");

    app.get("/menu", async (req, res) => {
      try {
        const data = cafeMenu.find();
        const result = await data.toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error fetching menu data: ", error); 
        res.status(500).send({ message: "Failed to retrieve menu" }); 
      }
    });

    

    app.get("/reviews", async (req, res) => {
      try {
        const data = cafeReviews.find();
        const result = await data.toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error fetching reviews data: ", error); 
        res.status(500).send({ message: "Failed to retrieve reviews" }); 
      }
    });

    app.post('/carts', async(req, res) => {
      const cartItem = req.body;
      const result = await cafeCart.insertOne(cartItem);
      res.send(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

// Only connect once, and keep the connection alive
connectToDB();

app.get("/", (req, res) => {
  res.send("Hi, I am Sadik");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
