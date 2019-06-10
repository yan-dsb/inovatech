//ROTAS DO ADMIN
var express = require("express");
var router = express.Router();
var Usuario = require("../models/usuario");
var Produto = require("../models/produto");

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


// router.post('/balanca', (req, res) => {
//     Balanca.create(req.body.balanca,(err, balanca)=>{
//         if (err) {
            
//         } else {
//             var usuFunc = req.body.log;
//             Usuario.findOne({username: req.body.cliente.username}, (err, usuario)=>{
//                 if (err) {
                    
//                 } else {
//                     usuario.usupontos += req.body.balanca.pontosTotal;
//                     usuario.save();
//                     Usuario.findOne({username: usuFunc}, (err, usuarioFunc)=>{
//                         if (err) {
                            
//                         } else {
//                             var usuariosBalanca = [usuario, usuarioFunc];
//                             Usuario.create(usuariosBalanca, (err, usuarioCF)=>{
//                                 if (err) {
                                    
//                                 } else {
//                                     balanca.usuarios.push(usuarioCF);
//                                     balanca.save();                            
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
            
//           Produto.create(req.body.produto, (err, produtos)=>{
//             if (err) {
                
//             } else {
//                 balanca.produtos.push(produtos)
//                 balanca.save();  
//             }
//           });

          
//         }
//     });
// });

//prototipo
router.post('/balanca', (req, res) => {
    Balanca.create(req.body.balanca,(err, balanca)=>{
        if (err) {
            
        } else {
            Usuario.findOne({username : req.body.login},(err, usuarioFound)=>{
                if (err) {
                            
                }else{
                    usuarioFound.usupontos += req.body.totalpontos;
                    usuarioFound.save();
                    Usuario.create(usuarioFound, currentuser, (err, usuarioCF)=>{
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