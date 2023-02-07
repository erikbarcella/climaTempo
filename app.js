var request = require("request");
var express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Temp = require("./models/temp")
require('dotenv').config();

mongoose.connect('mongodb://0.0.0.0:27017/dbTempo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> {
    console.log("Conexao com o db ligada com sucesso ")
})
    .catch(err=>{
    console.log("Erro ao se conectar com o banco ")
    console.log(err)
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let resposta ={};

app.get("/", (req,res)=>{
    res.render("home");
})

app.get('/favoritos', async(req, res) => {
    const favoritos = await Temp.find({});
    console.log(favoritos);
    res.render('favoritos', {favoritos});
});

//https://api.hgbrasil.com/weather?key=_name=Campinas,SP

app.get("/buscaCidade/:city", async (req,res)=>{
    const {city} =req.query;
    await request(`https://api.hgbrasil.com/weather?key=${process.env.API_KEY}&city_name=${city}`, (error, response, body) => {
        if(!error && response.statusCode == 200){
            resposta = JSON.parse(body);
        }
        console.log(resposta);
        res.render("resultadoBusca", {resposta});
    });  
})

app.post('/tempo/:city', async(req, res) => {
    const { city } = req.params;
    const tempEncontrado = await Temp.find({city: city});

    if (tempEncontrado.length == 0){
            const novaCidade = new Temp({city: city});
            await novaCidade.save();
            console.log("Cidade salva!");
    } else {
        console.log("Cidade já está na lista de favoritos.");
    }
});

let port=3030;
app.listen(port, ()=>{
    console.log("server running on port: "+ port);
})