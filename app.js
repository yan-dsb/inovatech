var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
//var seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/inovatech", {useNewUrlParser:true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//models
var Produto = require("./models/produto");
var Pessoa = require("./models/pessoa");
var Usuario = require("./models/usuario");

//seedDB();


/*Produto.create({
    nome: "Fonte 500W",
    imagemURL: "https://http2.mlstatic.com/fonte-atx-500w-real-mp500w-one-power-D_NQ_NP_643711-MLB20626067078_032016-F.jpg",
    peso: 10,
    pontos: 100
}, (err, produtos)=>{
    if (err) {
        console.log(err);
        
    }else{
        console.log(produtos);
        
    }
});*/

app.get('/', (req, res) => {
    res.send("home page");
});
app.get('/produtos', (req, res) => {
    Produto.find({}, (err, produtos)=>{
        if (err) {
            console.log(err);      
        } else {
            res.render("index", {produtos:produtos});
        }
    });
});

app.get('/produtos/new', (req, res) => {
   res.render("new"); 
});

app.get('/usuarios/new', (req, res) => {
    res.render("newUsuarios"); 
 });

app.get('/produtos/:id', (req, res) => {
    Produto.findById(req.params.id, (err,achouProduto)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.render("info", {produto: achouProduto})
        }
    });
});
app.delete('/produtos/:id', (req, res) => {
    Produto.findByIdAndDelete(req.params.id,(err,achouProduto)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.redirect("/produtos");
        }
    });
});



app.post('/produtos', (req, res) => {
    Produto.create(req.body.produto, (err,produto)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.redirect("/produtos");
        }
    });
});

app.post('/usuarios', (req, res) => {

    var data = Object.assign(req.body.usuario, {usupontos: 0}, {inadmin: 0} );
    
    Usuario.create(data, (err,usuario)=>{
        if (err) {
            console.log(err);
            
        } else {
            Pessoa.create(req.body.pessoa,(err, pessoa)=>{
                if (err) {
                    console.log(err);
                    
                } else {
                    usuario.pessoas.push(pessoa);
                    usuario.save();
                    console.log("Salvo com sucesso!");
                    
                }
            });
        }
    });
});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});