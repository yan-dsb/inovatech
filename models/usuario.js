var mongoose = require("mongoose");
var passportStratMongoose = require("passport-local-mongoose");

var comprovanteSchema = mongoose.Schema({
    comvalordesconto: Number,
    compontos: Number,
    datavalidade: String
});

var usuarioSchema = mongoose.Schema({
    username: String,
    password: String,
    usupontos: {type: Number, default: 0},
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

module.exports = mongoose.model("Usuario", usuarioSchema);