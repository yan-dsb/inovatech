//ROTAS INDEX
var express = require("express");
var router = express.Router();
var Pessoa = require("../models/pessoa");
var Usuario = require("../models/usuario");
var passport = require("passport");

router.get('/', (req, res) => {
    res.render("home");
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/register', (req, res) => {
    res.render("register");
});
router.get('/perfil', isLoggedIn, (req, res) => {
    res.render("perfil");
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/login");
});


function isLoggedIn(req, res, next){
        
        
        if (req.isAuthenticated()) {
            return next();
        }else{
            res.redirect("/");
        }
    
}
router.get('/sobre', (req, res) =>{
    res.render("sobre");
})
router.get('/info', (req, res) =>{
    res.render("info");
})

router.get('/login/success', (req, res) => {
    req.flash("successArr","Bem vindo!");
    res.redirect("/");
});

router.get('/login/failed', (req, res) => {
    req.flash("errorArr","Usuario ou senha incorreta!");
    res.redirect("/login");
});


router.get('/register/failed', (req, res) => {
    req.flash("errorArr","Usuario ja existe!");
    res.redirect("/register");
});

router.post('/register', (req, res) => {

    var usernameV = req.body.username;
    Usuario.findOne({username: usernameV}, (err, usuario)=>{
        if (err) {
            console.log(err);
            
        } else {
            if (usuario) {
                
                res.redirect('/register/failed');
                
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
                        
                    }
                    passport.authenticate("local")(req, res, function(){
                        res.redirect("/");
                    });
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