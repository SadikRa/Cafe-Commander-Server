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

    app.get("/menu", async (req, res) => {
      try {
        const data = cafeMenu.find(); // No need to assign to a variable if only chaining
        const result = await data.toArray(); // Await the conversion to array
        res.status(200).send(result); // Use status 200 to indicate a successful response
      } catch (error) {
        console.error("Error fetching menu data: ", error); // Log the error
        res.status(500).send({ message: "Failed to retrieve menu" }); // Send a 500 status in case of server errors
      }
    });

    // Send a ping to confirm a successful connection
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
