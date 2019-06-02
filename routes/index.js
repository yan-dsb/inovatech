//ROTAS INDEX
var express = require("express");
var router = express.Router();
var Pessoa = require("../models/pessoa");
var Usuario = require("../models/usuario");
var passport = require("passport");

router.get('/', (req, res) => {
    res.render("home");
});

router.get('/adminSecret', isLoggedIn, (req, res) => {
    res.render("admin/secret");
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/")
});


function isLoggedIn(req, res, next){
        
        
        if (req.isAuthenticated()&&req.user.inadmin===1) {
            return next();
        }else{
            res.redirect("/");
        }
    
}
router.get('/login/success', (req, res) => {
    req.flash("successArr","Bem vindo!");
    res.redirect("/");
});
router.get('/login/successAdmin', (req, res) => {
    req.flash("successArr","Bem vindo!");
    res.redirect("/secret");
});
router.get('/login/failed', (req, res) => {
    req.flash("errorArr","Usuario ou senha incorreta!");
    res.redirect("/login");
});

router.post('/register', (req, res) => {

    var usernameV = req.body.username;
    Usuario.findOne({username: usernameV}, (err, usuario)=>{
        if (err) {
            console.log(err);
            
        } else {
            if (usuario) {

                console.log({message: "user already exists"});
                
            }else{

                Usuario.register(new Usuario({username: usernameV}), req.body.password, (err, usuario)=>{
                    if (err) {
                        console.log(err);
                        
                        return res.render("register");
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
                            res.redirect("/");
                        });
                    }
                });
            }
        }
    });
    
});

router.post('/login', passport.authenticate("local",{
    successRedirect:"/login/success",
    failureRedirect:"/login/failed",
}),(req, res) => {
    
});


module.exports = router;