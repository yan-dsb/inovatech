//ROTAS DO ADMIN
var express = require("express");
var router = express.Router();
var Usuario = require("../models/usuario");


router.get('/admin/new', (req, res) => {
    res.render("admin/new"); 
 });

router.get('/search', (req, res) => {
    res.render("admin/search");
});

router.get('/search', (req, res) => {

    Usuario.findOne({username : req.query.login }).populate("pessoas").exec((err, usuarioC)=>{
        if (err) {
            
        } else {
            console.log(usuarioC);
            
            res.render("admin/balanca", {usuario: usuarioC}); 
        }
    });
});

router.get('/usuarios', (req, res) => {
    Usuario.find({}).populate("pessoas").exec((err, usuarios)=>{
        if (err) {
            console.log(err);      
        } else {
            console.log(usuarios);
            
            res.render("admin/usuarios", {usuarios:usuarios});
        }
    });
});



router.post('/balanca', (req, res) => {
    Balanca.create(req.body.balanca,(err, balanca)=>{
        if (err) {
            
        } else {
            var usuFunc = req.body.log;
            Usuario.findOne({usernamae: usuFunc}, (err, usuarioFunc)=>{
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

module.exports = router;