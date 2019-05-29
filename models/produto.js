var mongoose = require("mongoose");

var produtoSchema = mongoose.Schema({
    nome: String,
    imagemURL: String,
    peso: Number,
    pontos: Number
});

module.exports = mongoose.model("Produto", produtoSchema);
