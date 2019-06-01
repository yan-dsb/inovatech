//requires
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var localStrategy = require("passport-local");
var flash = require("connect-flash");

//rotas 
var produtosRotas = require("./routes/produtos");
var adminRotas = require("./routes/admin");
var indexRotas = require("./routes/index");
var usuariosRotas = require("./routes/usuarios");
//conexao mongodb
mongoose.connect("mongodb://localhost/inovatech", {useNewUrlParser:true});

//models
var Balanca = require("./models/balanca");
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
app.use(flash());       
//session
app.use(passport.initialize());
app.use(passport.session());
//encoding session and unencoding session
passport.use(new localStrategy(Usuario.authenticate()));
passport.serializeUser(Usuario.serializeUser());
passport.deserializeUser(Usuario.deserializeUser());


// passar o usuario para todas views
app.use(function(req , res , next)
{
    Usuario.findById(req.user).populate("pessoas").exec((err, usuario)=>{
        if (err) {
            
        } else {
            
            
        }
    
  res.locals.currentuser = usuario;
  res.locals.errorArr = req.flash("errorArr");
  res.locals.successArr = req.flash("successArr");
  next(); // importante
});
});


app.use(produtosRotas);
app.use(indexRotas);
app.use(usuariosRotas);
app.use(adminRotas);

app.get('*', (req, res) => {
    res.send("404 NOT FOUND");
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});