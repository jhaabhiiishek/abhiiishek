require('dotenv').config()
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const path = require("path");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const url = process.env.MONGO;

app.use(express.static(path.join(__dirname+"/public")))

async function run(a){
    try{ 
        const client = new MongoClient(url);
        const database = client.db("portfolio");
        const forms = database.collection("forms");
        const{name,email,subject,message} = a;
        const formEntry = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };
        const result =await forms.insertOne(formEntry);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        await client.close();
    }finally{
        console.log("done - and server connection closed")
    }
}

app.post("/formSubmit",(req,res)=>{
    run(req.body);
    res.sendStatus(200)
})

app.listen(process.env.PORT || 5000,()=>{
    console.log("Server Running")
})