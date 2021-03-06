require('dotenv').config()
const express= require("express")
const mongoose= require("mongoose")
var cors = require("cors");
// const dotenv= require('dotenv')
const app=express()
app.use(express.json())


const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

const DB= process.env.REACT_APP_API_KEY
const port= process.env.PORT
const connect=()=>{
    return mongoose.connect(DB,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    })
}


const productscheam= mongoose.Schema({
 prod_name:String,
 prod_description:String,
 size:[{
     size:String,
     price:Number,
     color:String
 }],
 category:String,
 prod_details:[],
 reviews:[
     {
        title:String,
        rev_desc:String,
        name:String,
        rating:Number,
        date:String
     }
 ],
 images:[],
 offer:Number,
 available_stock:Number
},{
    versionKey:false,
    timestamps: true
}
);

const Product= mongoose.model("product",productscheam)


app.post("/products", async(req,res)=>{
    const products= await Product.create(req.body)
     res.status(201).send(products)
 })
 



app.get("/products/:id", async (req,res)=>{
   const id= req.params.id
   let products= await Product.findById(id).lean().exec()

    res.status(201).send(products)
   
})
app.get("/products", async (req,res)=>{
    const id= req.params
    let products= await Product.find(req.query).lean().exec()

    res.status(201).send(products)
  
})

app.delete("/products/:id",async (req,res)=>{
    const id= req.params.id
   
    
    await Product.findByIdAndDelete(id)
    let products= await Product.find(req.query).lean().exec()

    res.status(201).send(products)
 
})

app.patch("/products/:id",async (req,res)=>{
    const id= req.params.id
   
    
   let update= await Product.findByIdAndUpdate(id,req.body,{new:true})
    let products= await Product.find(req.query).lean().exec()

    res.status(201).send(products)
 
})
async function start(){
    await connect()
    app.listen(port,()=>{
        console.log("localhost:8000");
    })
}
start()
