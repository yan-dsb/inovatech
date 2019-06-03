//ROTAS DO USUARIO
var express = require("express");
var router = express.Router();
var Usuario = require("../models/usuario");
var Pessoa = require("../models/pessoa");


router.get('/usuarios/:id', isLoggedIn, (req, res) => {
    Usuario.findById(req.params.id).populate("pessoas").exec((err, usuario)=>{
        if (err) {
            
        } else {
            var totalDesconto = 0;
            usuario.comprovantes.forEach(comp => {
                totalDesconto += comp.comvalordesconto;
            });
            
            if (totalDesconto >= 0.2) {
                console.log("Maximo de desconto por mes atingido");
                res.redirect("/");
            } else {
            
            res.render("usuarios/comprovantes", {usuario: usuario});
            } 
        }
    });
    
 });

 function isLoggedIn(req, res, next){
        
        
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect("/");
    }

}
 router.post('/comprovantes', (req, res) => {
    Usuario.findOne({username: req.body.username}, (err, usuario)=>{
        if (err) {
            
            
        } else {
            var totalDesconto = 0;
            usuario.comprovantes.forEach(comp => {
                totalDesconto += comp.comvalordesconto;
            });
            
            if (totalDesconto >= 0.2) {
                console.log("Maximo de desconto por mes atingido");
                res.redirect("/");
            } else {
            var pontos = 0;
            var pontosF = parseFloat(req.body.desconto);
            if (pontosF === 0.5) {
                pontos += 100;
            }
            if (pontosF === 0.1) {
                pontos += 200;
            }
            if (pontosF === 0.15) {
                pontos += 300;
            }
            if (pontosF === 0.2) {
                pontos += 400;
            }
            console.log(pontos);
            
            var data = {
                comvalordesconto:pontosF,
                compontos: pontos,
                datavalidade: "17/06/2019"
            }
            console.log(data);
            
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
        }
    });
});

module.exports = router;
