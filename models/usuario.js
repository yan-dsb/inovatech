var mongoose = require("mongoose");
var passportStratMongoose = require("passport-local-mongoose");


var comprovanteSchema = mongoose.Schema({
    comvalordesconto: {type: Number, default: 0},
    compontos: {type: Number, default: 0},
    comURL: String,
    datavalidade: String,
    dataCriado: {type:Date, default:Date.now}
});

var Comprovante = mongoose.model("Comprovante", comprovanteSchema);

var usuarioSchema = mongoose.Schema({
    username: String,
    password: String,
    usupontos: {type: Number, default: 100},
    inadmin: {type: Number, default: 0},
    default: 0,
    dthora: {type: Date, default:Date.now},
    pessoas: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pessoa"
        }
    ],
    comprovantes: [comprovanteSchema]
});

usuarioSchema.plugin(passportStratMongoose);  

module.exports = mongoose.model("Comprovante", comprovanteSchema);
module.exports = mongoose.model("Usuario", usuarioSchema);