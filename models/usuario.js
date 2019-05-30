var mongoose = require("mongoose");

var comprovanteSchema = mongoose.Schema({
    comvalordesconto: Number,
    compontos: Number,
    datavalidade: String
});

var usuarioSchema = mongoose.Schema({
    usulogin: String,
    ususenha: String,
    usupontos: Number,
    inadmin: Number,
    dthora: {type: Date, default:Date.now},
    pessoas: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pessoa"
        }
    ],
    comprovantes: [comprovanteSchema]
});

module.exports = mongoose.model("Usuario", usuarioSchema);