//requires
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportStratMongoose = require("passport-local-mongoose");

//conexao mongodb
mongoose.connect("mongodb://localhost/inovatech", {useNewUrlParser:true});

//models
var Balanca = require("./models/balanca");
var Produto = require("./models/produto");
var Usuario = require("./models/usuario");
var Pessoa = require("./models/pessoa");


//use session and start a function
app.use(require("express-session")({
    secret: "Joly is a cute cat",
    resave: false,
    saveUninitialized: false

}));

//use and set
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//session
app.use(passport.initialize());
app.use(passport.session());
//encoding session and unencoding session
passport.use(new localStrategy(Usuario.authenticate()));
passport.serializeUser(Usuario.serializeUser());
passport.deserializeUser(Usuario.deserializeUser());


app.get('/', (req, res) => {
    res.render("home");
});

app.get('/secret', isLoggedIn, (req, res) => {
    res.render("secret");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/")
});

app.get('/cadastrar', (req, res) => {
    res.render("cadastrar");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

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

app.post('/usuariosRegister', (req, res) => {

    // var data = Object.assign(req.body.usuario, {usupontos: 0}, {inadmin: 0} );
    var usernameV = req.body.username;
    Usuario.register(new Usuario({username: usernameV}), req.body.password, (err, usuario)=>{
        if (err) {
            console.log(err);
            
            return res.render("usuarios/new");
        } else {
            Pessoa.create(req.body.pessoa,(err, pessoa)=>{
                if (err) {
                    console.log(err);
                    
                } else {
                    usuario.pessoas.push(pessoa);
                    usuario.save();
                }
            });
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            });
        }
    });
});


app.post('/login', passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),(req, res) => {

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