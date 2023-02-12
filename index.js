require('dotenv').config()
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const nodemailer= require('nodemailer');
const path = require("path");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const url = process.env.MONGO;

app.use(express.static(path.join(__dirname+"/build")))


app.post("/formSubmit",async (req,res)=>{
    if(req.body.name !=""||req.body.email!=""||req.body.subject!=""||req.body.message!=""){
        try{
            const client = new MongoClient(url);
            const database = client.db("portfolio");
            const forms = database.collection("forms");
            const{name,email,subject,message} = req.body;
            const formEntry = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };
            const result =await forms.insertOne(formEntry);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            await client.close();
        
                
            let transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.LMNTOPQ,
                    pass:process.env.WHAT,
                },
                tls:{
                    rejectUnauthorized:false,
                }
            })
            let mailOptions = {
                from:process.env.LMNTOPQ,
                to:process.env.LFMNO,
                subject:subject,
                text:"Name = "+name+" email = "+email+" message: "+message
            }
            
            transporter.sendMail(mailOptions,function(err, success){
                if(err){
                    console.log(err)
                }else{
                    console.log("Email sent successfully!!")
                }
            })
        }finally{
            console.log("done - and server connection closed")
        }
    }
    res.sendStatus(200)
})

app.listen(process.env.PORT||3000,()=>{
    console.log("Server Running")
})