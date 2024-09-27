const express = require('express') 
const bot = require('./bot')


const app = express()

app.get("/",(async (req,res)=>{
    res.json(await bot)

}))
   
app.listen(8000,()=>{
    console.log("Server starting http://localhost:8000")
})