const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT||5000;
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("Chil Gamer Server Is Review On")
})
app.listen(port,()=>{
    console.log(`Chil Gamer Server Is Running On port:${port}`)
})