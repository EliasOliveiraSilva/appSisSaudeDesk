const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SolicitacaoVisita = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    status:{
        type: String,
        enum: ['Pendente', 'Cumprido'],
        required: true
    },
    observacao:{
        type: String,
        required: true
    },
    usuario:{
        type: String,
        required: true
    }
})

mongoose.model("solicitacaovisita", SolicitacaoVisita)