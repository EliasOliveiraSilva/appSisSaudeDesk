const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")

//Model medicamentos
require('../models/Medicamento')
const Medicamento = mongoose.model('medicamentos')

//Model SolicitacaoMedicamentos
require('../models/SolicitacaoMedicamento')
const SolicitacaoMedicamento = mongoose.model('solicitacaomedicamento')

//Model SolicitacaoVisita
require('../models/SolicitacaoVisita')
const SolicitacaoVisita = mongoose.model('solicitacaovisita')

//helper para restrição de niveis de rotas
//const {eAdmin} = require('../helpers/eAdmin')

//********** */
router.get('/', (req, res) => {
    res.render('admin/index')
})

//Rotas referentes a ações de cadastro e exibição de medicamentos
router.get('/medicamentos', (req, res) => {
    Medicamento.find().sort({nome:'asc'}).then((medicamentos) => {
        res.render('admin/medicamentos', {medicamentos: medicamentos.map(medicamentos => medicamentos.toJSON())})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os medicamentos')
        res.redirect('/admin')
    })
})

router.get('/medicamentos/add', (req, res) => {
    res.render('admin/addmedicamentos')
})

router.post('/medicamentos/novo', (req, res) => {
    //validação do formulário
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido ou nulo !!" })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome do medicamento muito pequeno !!" })
    }

    if (!req.body.nomeGenerico || typeof req.body.nomeGenerico == undefined || req.body.nomeGenerico == null) {
        erros.push({ texto: "Nome genérico inválido ou nulo !!" })
    }

    if (req.body.nomeGenerico.length < 2) {
        erros.push({ texto: "Nome genérico do medicamento muito pequeno !!" })
    }

    if (erros.length > 0) {
        res.render('admin/addmedicamentos', { erros: erros })
    } else {
        const novoMedicamento = {
            nome: req.body.nome,
            nomeGenerico: req.body.nomeGenerico
        }

        new Medicamento(novoMedicamento).save().then(() => {
            req.flash('success_msg', 'Medicamento cadastrado com sucesso !!')
            res.redirect('/admin/medicamentos')
        }).catch((err) => {
            req.flash('erro_msg', 'Erro ao cadastrar medicamento !!')
            res.redirect('/admin')
        })
    }
    //fim da validação

})
//fim da rota para o formulário de cadastro de medicamentos

//Rotas de edição de medicamentos
router.get('/medicamentos/edit/:id', (req, res) => {
    Medicamento.findOne({_id:req.params.id}).lean().then((medicamentos) => {
        res.render('admin/editmedicamento', {medicamentos: medicamentos})
    }).catch((err) => {
        req.flash('error_msg', 'Medicamento não existe')
        res.render('admin/medicamentos')
    })
})

router.post('/medicamentos/edit', (req, res) => {
    Medicamento.findOne({_id: req.body.id}).then((medicamentos) =>{

        medicamentos.nome = req.body.nome
        medicamentos.nomeGenerico = req.body.nomeGenerico

        medicamentos.save().then(() => {
            req.flash('success_msg', 'Medicamento editado com sucesso !')
            res.redirect('/admin/medicamentos')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao editar o medicamento')
            res.redirect('/admin/medicamentos')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar o medicamento !')
        res.redirect('/admin/medicamentos')
    })
})
//fim das rotas de edição dos medicamentos

//Rota para deletar cadastro de medicamento
router.post('/medicamentos/deletar', (req, res) => {
    Medicamento.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Medicamento excluido com sucesso !')
        res.redirect('/admin/medicamentos')
    }).catch((err) => {
        req.flash('error_msg', 'Error ao excluir o medicamento')
        res.redirect('/admin/medicamentos')
    })
})

//Rotas para cadastro e edição de solicitação de medicamentos
router.get('/solicitaMedicamento', (req, res) => {
    res.render('admin/solicitaMedicamento')
})

router.get('/solicitaMedicamento/add', (req, res) => {
    Medicamento.find().sort({nome:'asc'}).then((medicamentos) => {
        res.render('admin/addsolicitamedicamento', {medicamentos: medicamentos.map(medicamentos => medicamentos.toJSON())})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os medicamentos')
    })
})

router.post('/solicitacaoMedicamento/nova', (req, res) => {
    
    const novaSolicitacaoMedicamento = {
        medicamento: req.body.medicamento,
        observacao: req.body.observacao,
        status: req.body.status
    }

    new SolicitacaoMedicamento(novaSolicitacaoMedicamento).save().then(() => {
        console.log("Solicitação salva com sucesso")
    }).catch((err) => {
        console.log("Erro ao salvar a solicitação")
    })
})
//Fim das rotas para solicitações de medicamentos

//Rotas para cadastro e edição de solicitações de visitas
router.get('/solicitaVisita', (req, res) => {
    res.render('admin/solicitaVisita')
})

router.get('/solicitaVisita/add', (req, res) => {
    res.render('admin/addsolicitavisita')
})

router.post('/solicitaVisita/nova', (req, res) => {

    const novaSolicitacaoVisita = {
        observacao: req.body.observacao,
        status: req.body.status,
        usuario: req.body.usuario
    }

    new SolicitacaoVisita(novaSolicitacaoVisita).save().then(() => {
        console.log("Solicitação de visita salva com sucesso")
    }).catch((err) => {
        console.log("Erro ao salvar a solicitação")
        res.redirect('/admin')
    })
})

module.exports = router