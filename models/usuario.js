var mongoose = require("mongoose");
var passportStratMongoose = require("passport-local-mongoose");


var comprovanteSchema = mongoose.Schema({
    comvalordesconto: Number,
    compontos: Number,
    datavalidade: String
});

var Comprovante = mongoose.model("Comprovante", comprovanteSchema);

var usuarioSchema = mongoose.Schema({
    username: String,
    password: String,
    usupontos: {type: Number, default: 400},
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

// usuarioSchema.methods.validatePassword = function(password) {
//     const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
//     return this.hash === hash;
// };

usuarioSchema.plugin(passportStratMongoose);  

module.exports = mongoose.model("Comprovante", comprovanteSchema);
module.exports = mongoose.model("Usuario", usuarioSchema);