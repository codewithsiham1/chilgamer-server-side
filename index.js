const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    
    const usercollection=client.db('usersDB').collection("users")
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