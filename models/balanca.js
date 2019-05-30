var mongoose = require("mongoose");


var balancaSchema = mongoose.Schema({
	baltotalpeso: Number,
	baltotalpontos: Number,
    dthora: {type: Date, default:Date.now},
    usuarios:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }
    ],
    produtos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Produto"
        }
    ]
});


module.exports = mongoose.model("Balanca", balancaSchema);