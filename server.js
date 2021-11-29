const express = require("express")
const handlabars = require("express-handlebars")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")

const app = express()

const admin = require('./router/admin')

const usuarios = require('./router/usuario')

const api = require('./router/api')

const passport = require("passport")

require('./config/auth')(passport)

//Configurações
//const PORT = 3000

//Cria da sessão
app.use(session({
    secret: "sissaudefamiliar",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
//Criação do arquivo flash
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

//Configuação mongoDB
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/websis', { useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log("Conectado ao Mongo DB")
}).catch((err) => {
    console.log("Erro ao se conecatar" + err)
})
//Fim da configuração do mongoDB

app.use(express.static(path.join(__dirname, "public")))

app.use(express.urlencoded({extended:this}))
app.use(express.json())

app.engine('hbs', handlabars({defaultLayout: 'main', extname:'.hbs'}))
app.set('view engine', 'hbs')

//Router
//Inicial
app.get('/', (req, res) => {
    res.render('index')
})

//Área administrativa
app.use('/admin', admin)
//Fim da área administrativa

//Área de usuários
app.use('/usuarios', usuarios)
//Fim da área de usuários

//àrea Api mobile
app.use('/api', api)
//Fim da área de Api

module.exports = app