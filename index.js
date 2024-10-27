const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
var jwt = require('jsonwebtoken');

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

    const userCollection = client.db("CafeUser").collection("users");
    const cafeMenu = client.db("CafeUser").collection("menu");
    const cafeReviews = client.db("CafeUser").collection("reviews");
    const cafeCart = client.db("CafeUser").collection("carts");

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const perviousUser = await userCollection.findOne(query);
      if (perviousUser) {
        return res.send("user already have account");
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result);
    });

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

    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const data = await cafeCart.find(query).toArray();
      res.send(data);
    });

    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cafeCart.insertOne(cartItem);
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cafeCart.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
