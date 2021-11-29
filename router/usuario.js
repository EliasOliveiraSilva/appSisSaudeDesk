const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

require('../models/Usuario')
const Usuario = mongoose.model('usuario')

require('../models/SolicitacaoMedicamento')
const SolicitaMedicamento = mongoose.model('solicitacaomedicamento')

router.get('/', (req, res) => {
    res.render('usuarios/index')
})

router.get('/listar', (req, res) => {
    Usuario.find().sort({nome: 'asc'}).then((usuarios) => {
        res.render('usuarios/listar', {usuarios: usuarios.map(usuarios => usuarios.toJSON())})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os usuários')
        res.render('/usuarios')
    })
})

router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido !"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválido !"})
    }
    if(!req.body.senha2 || typeof req.body.senha2 == undefined || req.body.senha2 == null){
        erros.push({texto: "Preencha e senha novamente !"})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas não conferem e/ou inválidas !"})
    }
    if(erros.length > 0){
        res.render('usuarios/registro', {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash('error_msg', 'E-mail já cadastrado !!')
                res.redirect('/usuarios/registro')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    rg: req.body.rg,
                    cpf: req.body.cpf,
                    susNumero: req.body.susNumero,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash('error_msg', 'Houve um error ao salvar usuário !!')
                            res.redirect('/')
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash('success_msg', 'Usuário criado com sucesso !!')
                            res.redirect('/')
                        }).catch((err) => {
                            req.flash('error_msg', 'Houve um error ao registrar o usuário')
                            res.redirect('/usuarios/registro')
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    }
})

router.get('/edit/:id', (req, res) => {
    Usuario.findOne({_id: req.params.id}).lean().then((usuarios) => {
        res.render('usuarios/editusuario', {usuarios: usuarios})
    }).catch((err) => {
        req.flash('error_msg', 'Usuário não existe')
        res.redirect('usuarios/listar')
    })
})

router.post('/usuarios/edit', (req, res) => {})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'Usuário deslogado com sucesso !!')
    res.redirect('/')
})

module.exports = router