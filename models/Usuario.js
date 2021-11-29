const mongoose =require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    rg: {
        type: String,
        required: true,
        default: '00000000'
    },
    cpf: {
        type: Number,
        required: false
    },
    susNumero: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        default: 0
    },
    perfil: {
        type: String,
        enum: ['usuario', 'acompanhante', 'agente', 'supervisor'],
        default:'usuario'
    },
    solicitacaoVisita: {
        type: Schema.Types.ObjectId,
        ref: "solicitacaovisita"
    },
    solicitacaoMedicamento: {
        type: Schema.Types.ObjectId,
        ref: "solicitacaomedicamento"
    }
})

mongoose.model("usuario", Usuario)