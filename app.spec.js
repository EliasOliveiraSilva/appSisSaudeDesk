const request = require('supertest')
const app = require('./server')

describe('Testes de Rotas', () => {
    it('Teste se a ronta principal retorna true', async () => {

        const res = await request(app)
            .get('/')

        expect(res.statusCode).toEqual(200)
    })

    it('Teste se a ronta admin retorna true', async () => {

        const res = await request(app)
            .get('/admin')

        expect(res.statusCode).toEqual(200)
    })

    it('Teste se a ronta usuarios esta retornando true', async () => {

        const res = await request(app)
            .get('/usuarios/listar')

        expect(res.statusCode).toEqual(200)
    })

    it('Teste se a ronta usuario retorna uma solicitação', async () => {

        const res = await request(app)
            .get('/api')
            .auth('email', 'senha')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)

        expect(res.body).toHaveProperty('usuarios')
    })
})
