const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor.js')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/', async (req, res) => {
    const results = await TabelaFornecedor.listar()
    res.status(200)
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['empresa'])
    res.send(
        serializador.serializar(results)
    )
})

roteador.post('/', async(req, res, prox) => {
    try{
        const dados = req.body
        const fornecedor = new Fornecedor(dados)
        await fornecedor.criar()
        res.status(201)
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['empresa'])
        res.send(serializador.serializar(fornecedor))
    }catch(err){
        prox(err)
    }
})

roteador.options('/:idFornecedor', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/:id', async(req, res, prox) => {
    
    try{
        const id = req.params.id
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        res.status(200)
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['empresa','email', 'dataCriacao', 'dataAtualizacao', 'versao'])
        res.send(serializador.serializar(fornecedor))
    }catch(err){
        prox(err)
    }
})

roteador.put('/:id', async (req, res, prox) => {
    try{
        const id = req.params.id
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {id})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204)
        res.end()

    }catch(err){
        prox(err)
    }
})

roteador.delete('/:id', async (req, res, prox) => {
    
    try{
        const id = req.params.id
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        await fornecedor.deletar()
        res.status(204)
        res.end()

    }catch(err){
        prox(err)
    }
})

const roteadorProdutos = require('./produtos')

const verificarFornecedor = async (req, res, prox) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({id})
        await fornecedor.carregar()
        req.fornecedor = fornecedor
        prox()
    } catch (error) {
        prox(error)
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador