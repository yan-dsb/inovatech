var mongoose = require("mongoose");

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
    ]
});

module.exports = mongoose.model("Usuario", usuarioSchema);