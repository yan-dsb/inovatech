//ROTAS DO ADMIN
var express = require("express");
var router = express.Router();
var Usuario = require("../models/usuario");
var Produto = require("../models/produto");
var Balanca = require("../models/balanca");

router.get('/adminSecret', isLoggedIn, (req, res) => {
    res.render("admin/secret");
});

router.get('/admin/new', isLoggedIn, (req, res) => {
    res.render("admin/new"); 
 });

router.get('/search', isLoggedIn, (req, res) => {
    Usuario.findOne({username : req.query.login }).populate("pessoas").exec((err, usuario)=>{
        if (err) {
            
        } else {
            Produto.find({}, (err, produto)=>{
                if (err) {
                    
                } else {
                    console.log(usuario);
                    
                    res.render("admin/balanca", {usuario: usuario, produto: produto},); 
                }
            });
            
        }       
    });
});

router.get('/balanca', isLoggedIn, (req, res) => {

    Usuario.findOne({username : req.query.login }).populate("pessoas").exec((err, usuario)=>{
        if (err) {
            
        } else {
            Produto.find({}, (err, produto)=>{
                if (err) {
                    
                } else {
                    res.render("admin/balanca", {usuario: usuario, produto: produto},); 
                }
            });
            
        }       
    });
});

router.get('/usuarios', isLoggedIn, (req, res) => {
    Usuario.find({}).populate("pessoas").exec((err, usuarios)=>{
        if (err) {
            console.log(err);      
        } else {   
            res.render("admin/usuarios", {usuarios:usuarios});
        }
    });
});

function isLoggedIn(req, res, next){
        
        
    if (req.isAuthenticated()&&req.user.inadmin===1) {
        return next();
    }else{
        res.redirect("/");
    }

}



router.post('/balanca',isLoggedIn, (req, res) => {
    Balanca.create(req.body.balanca,(err, balanca)=>{
        if (err) {
            
        } else {
            Usuario.findOne({username : req.body.login},(err, usuarioFound)=>{
                if (err) {
                            
                }else{
                    usuarioFound.usupontos += parseInt(req.body.balanca.baltotalpontos);
                    usuarioFound.save();
                    Usuario.findOne({username : req.body.usuarioFunc}, (err, usuarioFunc)=>{
                        if (err) {
                            
                        } else {
                            balanca.usuarios.push(usuarioFunc, usuarioFound);
                            balanca.save();
                            console.log(balanca);                                
                        }
                    });
                }
            });
         res.redirect('/balanca'); 
        }
    });
});


module.exports = router;