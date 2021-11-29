const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

require('../models/Usuario')

const Usuarios = mongoose.model('usuario')

router.get('/', (req, res) => {
    Usuarios.find().then((usuarios) => {
        res.json({usuarios: usuarios})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar os usuários")
    })
})

router.post('/user',async (req, res) => {
    let response = await Usuarios.findOne({email: req.body.email})
    if(response === null){
        res.send(JSON.stringify('erro'))
    }else{
        res.send(response)
    }
})

module.exports = router