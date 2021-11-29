const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Medicamento = require('./Medicamento')

const SolicitacaoMedicamento = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    status:{
        type: String,
        enum: ['Pendente', 'Cumprido'],
        default: "Pendente",
        required: true
    },
    observacao:{
        type: String,
        required: true
    },
    medicamento: {
        type: Schema.Types.ObjectId,
        ref: "medicamentos",
        required: true
    }
})

mongoose.model("solicitacaomedicamento", SolicitacaoMedicamento)