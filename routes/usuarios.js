//ROTAS DO USUARIO
var express = require("express");
var router = express.Router();
var Usuario = require("../models/usuario");
var Pessoa = require("../models/pessoa");


router.get('/usuarios/:id', (req, res) => {
    Usuario.findById(req.params.id).populate("pessoas").exec((err, usuario)=>{
        if (err) {
            
        } else {
            
            res.render("usuarios/comprovantes", {usuario: usuario}); 
        }
    });
    
 });

 router.post('/comprovantes', (req, res) => {
    Usuario.findOne({username: req.body.username}, (err, usuario)=>{
        if (err) {
            
        } else {
            var data = {
                comvalordesconto: 0.10,
                compontos: 200,
                datavalidade: "29/06/2019"
            }
            usuario.comprovantes.push(data);
            usuario.usupontos -= data.compontos;
            console.log(usuario);
            
            usuario.save((err, usu)=>{
                if (err) {
                    console.log(err);
                    
                } else {
                    console.log(usu);
                    res.redirect("/");
                    
                }
            });
        }
    });
});

module.exports = router;
