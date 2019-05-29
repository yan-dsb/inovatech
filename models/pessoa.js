var mongoose = require("mongoose");


var pessoaSchema = mongoose.Schema({
	pescpf: String,
	pesnome: String,
	pestelefone: Number,
	dthora: {type: Date, default:Date.now}
});


module.exports = mongoose.model("Pessoa", pessoaSchema);