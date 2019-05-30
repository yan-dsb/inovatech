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
var Balanca = require("./models/balanca");
var Produto = require("./models/produto");
var Usuario = require("./models/usuario");
var Pessoa = require("./models/pessoa");

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
            res.render("produtos/produtos", {produtos:produtos});
        }
    });
});

app.get('/usuarios', (req, res) => {
    Usuario.find({}).populate("pessoas").exec((err, usuarios)=>{
        if (err) {
            console.log(err);      
        } else {
            console.log(usuarios);
            
            res.render("usuarios/usuarios", {usuarios:usuarios});
        }
    });
});

app.get('/produtos/new', (req, res) => {
   res.render("produtos/new"); 
});

app.get('/usuarios/new', (req, res) => {
    res.render("usuarios/new"); 
 });

app.get('/balanca', (req, res) => {
    res.render("balanca/search");
});

app.get('/balanca/search', (req, res) => {

    Usuario.findOne({usulogin : req.query.login }).populate("pessoas").exec((err, usuarioC)=>{
        if (err) {
            
        } else {
            console.log(usuarioC);
            
            res.render("balanca/balanca", {usuario: usuarioC}); 
        }
    });
});
 app.get('/usuarios/:id/comprovantes', (req, res) => {
    Usuario.findById(req.params.id).populate("pessoas").exec((err, usuario)=>{
        if (err) {
            
        } else {
            res.render("usuarios/comprovantes", {usuario: usuario}); 
        }
    });
    
 });

app.get('/produtos/:id', (req, res) => {
    Produto.findById(req.params.id, (err,achouProduto)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.render("produtos/info", {produto: achouProduto})
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
                    res.redirect("usuarios/usuarios");
                    
                    
                }
            });
        }
    });
});


//rota nao funcionando, ainda não temos tela de gerar comprovante
app.get('/comprovantes', (req, res) => {
    Usuario.findOne({usulogin: "k@gmail"}, (err, usuario)=>{
        if (err) {
            
        } else {
            var data = {
                comvalordesconto: 0.10,
                compontos: 200,
                datavalidade: "29/06/2019"
            }
            usuario.comprovantes.push(data);
            usuario.save((err, usu)=>{
                if (err) {
                    console.log(err);
                    
                } else {
                    console.log(usu);
                    res.redirect("usuarios/comprovantes");
                    
                }
            });
        }
    });
});



app.post('/balanca', (req, res) => {
    Balanca.create(req.body.balanca,(err, balanca)=>{
        if (err) {
            
        } else {
            var usuFunc = req.body.log;
            Usuario.findOne({usulogin: usuFunc}, (err, usuarioFunc)=>{
                if (err) {
                    
                } else {
                    Usuario.create(req.body.cliente, usuarioFunc, (err, usuarioCF)=>{
                        if (err) {
                            
                        } else {
                            balanca.usuarios.push(usuarioCF);
                            balanca.save();                            
                        }
                    });
                }
            });
          Produto.create(req.body.produto, (err, produtos)=>{
            if (err) {
                
            } else {
                balanca.produtos.push(produtos)
                balanca.save();  
            }
          });

          
        }
    });
});


app.get('*', (req, res) => {
    res.send("404 NOT FOUND");
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});