//ROTAS DO PRODUTO

var express= require("express");
var router = express.Router();
var Produto = require("../models/produto");

router.get('/produtos', (req, res) => {
    Produto.find({}, (err, produtos)=>{
        if (err) {
            console.log(err);      
        } else {
            res.render("produtos/produtos", {produtos:produtos});
        }
    });
});

router.get('/produtos/new', (req, res) => {
    res.render("produtos/new"); 
});

router.get('/produtos/:id', (req, res) => {
    Produto.findById(req.params.id, (err,achouProduto)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.render("produtos/info", {produto: achouProduto})
        }
    });
});
router.put('/produtos/:id/update', (req, res) => {
    
});

router.post('/produtos', (req, res) => {
    Produto.create(req.body.produto, (err,produto)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.redirect("/produtos");
        }
    });
});

router.delete('/produtos/:id', (req, res) => {
    Produto.findByIdAndDelete(req.params.id,(err,achouProduto)=>{
        if (err) {
            console.log(err);
            
        } else {
            res.redirect("/produtos");
        }
    });
});

module.exports = router;