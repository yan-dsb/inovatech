//ROTAS DO USUARIO
var express = require("express");
var router = express.Router();
var Usuario = require("../models/usuario");

var PDFDocument = require('pdfkit');
var fs = require('fs');
var QRCode = require('qrcode')
var moment = require('moment')

router.get('/gerardesconto/:id', isLoggedIn, (req, res) => {
    Usuario.findById(req.params.id).populate("pessoas").exec((err, usuario)=>{
        if (err) {
            
        } else {
            res.render("usuarios/gerardesconto", {usuario: usuario});
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

router.get('/perfil', isLoggedIn, (req, res) => {
        res.render("usuarios/perfil");
});


router.get('/comprovantes/:id', isLoggedIn, (req,res)=>{
    Usuario.findOne({_id: req.params.id},(err, usuario)=>{
        if (err) {
            
        } else {
            
            res.render('usuarios/comprovantes', {usuario: usuario});
        }
    });
 });
 router.get('/download/:id',isLoggedIn, (req, res)=>{
        var dir = 'uploads/'+req.params.id;
        res.download(dir);
 });


 router.post('/gerardesconto',isLoggedIn, (req, res) => {
    QRCode.toFile('uploads/qrcode.png', 'Desconto utilizado com sucesso!', {
        color: {
        dark: '#00F',  // Blue dots
         light: '#0000' // Transparent background
        }
     }, function (err) {
        if (err) throw err
        console.log('done')
     })
    Usuario.findOne({username: req.body.username}).populate("pessoas").exec((err, usuario)=>{
        if (err) {
            
            
        } else {
            var nomeCliente = "";
            var cpfCliente = "";
            var telefoneCliente= "";
            usuario.pessoas.forEach(pessoa=>{
                nomeCliente = pessoa.pesnome;
                cpfCliente = pessoa.pescpf;
                telefoneCliente = pessoa.pestelefone;
            });
            
            var doc = new PDFDocument();
            var pdfURL = 'comprovante'+Date.now()+'.pdf';

           
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
            var desc = "";
            if (pontosF === 0.05) {
                pontos += 100;
                desc = "5%";
            }
            if (pontosF === 0.1) {
                pontos += 200;
                desc = "10%";
            }
            if (pontosF === 0.15) {
                pontos += 300;
                desc = "15%";
            }
            if (pontosF === 0.2) {
                pontos += 400;
                desc = "20%";
            }

            var dataVal = moment().add('1', "month").format("LLL");
            
            
            var data = {
                comvalordesconto:pontosF,
                compontos: pontos,
                comURL: pdfURL,
                datavalidade: dataVal
            }

            var dir = 'uploads/'+ pdfURL;   
            doc.pipe(fs.createWriteStream(dir));
            doc.image('public/imagens/ediscard.png', 280, 1, {fit: [100, 100], align: 'center', valign: 'center'});
            doc.moveDown();
            doc.text('                                           ');
            doc.moveDown();
            doc.text('Cliente: '+nomeCliente, {align: 'center'});
            doc.moveDown();
            doc.text('CPF: '+cpfCliente, {align: 'center'});
            doc.moveDown();
            doc.text('Telefone: '+telefoneCliente, {align: 'center'});
            doc.moveDown();
            doc.text('Valor desconto: '+desc, {align: 'center'});
            doc.moveDown();
            doc.text('Pontos utilizados: '+pontos, {align: 'center'});
            doc.moveDown();
            doc.text('Data de validade: '+dataVal, {align: 'center'});
            doc.moveDown();
            doc.image('uploads/qrcode.png', 280, 280, {fit: [100, 100], align: 'center', valign: 'center'});
            doc.end();

            usuario.comprovantes.push(data);
            usuario.usupontos -= data.compontos;
            
            usuario.save((err, usu)=>{
                if (err) {
                    console.log(err);
                    
                } else {
                    //console.log(usu);
                    res.render('usuarios/download', {usuario: usu});
                }
            });

            } 
            
        }
    });
});

module.exports = router;
