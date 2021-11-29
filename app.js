const app = require('./server')
//Configurações
const PORT = 3000

app.listen(PORT, () => {
    console.log("Servidor rodando")
})