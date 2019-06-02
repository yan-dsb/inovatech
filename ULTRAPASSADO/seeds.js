var mongoose = require("mongoose");
var Pessoa = require("./models/pessoa");
var Usuario   = require("./models/usuario");
 
var data = [
    {
     usulogin: "yan@gmail",
     ususenha: "3212",
     usupontos: 200,
     inadmin: 1   
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Usuario.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("usuarios removidos");
        Pessoa.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("pessoas removidas");
             //add a few campgrounds
            data.forEach(function(seed){
                Usuario.create(seed, function(err, usuario){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("ad usuario");
                        //create a comment
                        Pessoa.create(
                            {
                                pescpf: "700779612-50", 
                                pesnome: "Yan Borges",
                                pesemail: "yan@gmail",
                                pestelefone: 994276409

                                }, function(err, pessoa){
                                if(err){
                                    console.log(err);
                                } else {
                                    usuario.pessoas.push(pessoa);
                                    usuario.save();
                                    console.log("usuario criado");
                                    console.log(usuario);
                                    
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;
