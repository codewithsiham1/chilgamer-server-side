const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT||5000;
app.use(cors())
app.use(express.json())
// Chilgamerauth
// O8z4eYgMDIcUmd7W

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.leope.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const reviewCollection=client.db("reviewDB").collection("review")
    const usercollection=client.db('usersDB').collection("users")
    const watchlistCollection = client.db('watchlistDB').collection('watchlist');
    // users api
    app.get("/users/:email",async(req,res)=>{
     const email=req.params.email
     const user=await usercollection.findOne({email});
      res.send(user)
    })
    app.post('/users',async(req,res)=>{
      const newuser=req.body;
      console.log("Creatning a newuser",newuser)
      const result=await usercollection.insertOne(newuser);
      res.send(result)
    })
    app.patch("/users",async(req,res)=>{
      const email=req.body.email;
      const filter={email}
      const updatedDoc={
        $set:{
          lastlogintime:req.body.lastlogintime
        }
      }
      const result=await usercollection.updateOne(filter,updatedDoc);
      res.send(result)
    })
    // review api
    app.get("/review",async(req,res)=>{
      const reviews=await reviewCollection.find({}).toArray();
      res.send(reviews)
    })
    app.post("/review",async(req,res)=>{
      const newReview=req.body;
      const result=await reviewCollection.insertOne(newReview);
      res.send(result)
    })
    app.get('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const review = await reviewCollection.findOne(query);
      res.send(review);
  });

  app.delete('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
  });

  app.put('/review/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
          $set: req.body
      };
      const result = await reviewCollection.updateOne(filter, { $set: updatedDoc });
      res.send(result);
  });
// ওয়াচলিস্ট এপিআই
app.post('/watchlist', async (req, res) => {
  try {
      const newWatchlistItem = req.body;
      const result = await watchlistCollection.insertOne(newWatchlistItem);
      res.send(result);
  } catch (error) {
      console.error('Error adding to watchlist:', error);
      res.status(500).send({ message: 'Error adding to watchlist' });
  }
});

app.get('/watchlist/:email', async (req, res) => {
  const email = req.params.email;
  const query = { userEmail: email };
  const watchlistItems = await watchlistCollection.find(query).toArray();
  res.send(watchlistItems);
});

app.delete('/watchlist/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await watchlistCollection.deleteOne(query);
  res.send(result);
});
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Chil Gamer Server Is Review On")
})
app.listen(port,()=>{
    console.log(`Chil Gamer Server Is Running On port:${port}`)
})