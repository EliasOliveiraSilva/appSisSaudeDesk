const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Medicamento = new Schema({
    nome: {
        type: String,
        required: true
    },
    nomeGenerico: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("medicamentos", Medicamento)