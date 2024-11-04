const express = require("express");
const cookieParse = require("cookie-parser")
const app = express();
const cors = require('cors');


const pags = require("../pages/pags");


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use( express.urlencoded({
    extended: true
    })
);

app.use(cookieParse())

app.use("/", pags); 

app.use(cors({
    origin: 'https://site-back-end-orpin.vercel.app', // Substitua pela URL do seu site
    credentials: true,              // Permite o envio de credenciais
  }));

app.use("/teste", (req, res)=>{
    try{
        res.status(200).send({
            message: 'hello world'
        });
    }catch( err){
        res.status(500);
    };
        
});

module.exports = app;

