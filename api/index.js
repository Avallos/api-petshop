const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

const app = express()
app.use(bodyParser.json())

app.use((req, res, prox) => {
    res.set('X-Powered-By', 'Douglas Avallos')
    prox()
})

app.use((req, res, prox) => {
    let formatoRequisitado = req.header('Accept')

    if(formatoRequisitado === '*/*'){
        formatoRequisitado = 'application/json'
    }

    if(formatosAceitos.indexOf(formatoRequisitado) === -1){
        res.status(406)
        res.end()
        return
    }

    res.setHeader('Content-Type', formatoRequisitado)
    prox()
})

app.use((req, res, prox) => {
    res.set('Access-Control-Allow-Origin', '*')
    prox()
})

app.use('/api/fornecedores', roteador)
const roteadorV2 = require('./rotas/fornecedores/rotas.v2')
app.use('/api/v2/fornecedores', roteadorV2)

app.use((err, req, res, prox) => {
    let status = 500
    if(err instanceof NaoEncontrado){
        status = 404
    }
    if(err instanceof CampoInvalido ||err instanceof DadosNaoFornecidos){
        status = 400
    }

    if(err instanceof ValorNaoSuportado){
        res.send = 406
    }
    
    res.status(status)
    const serializador = new SerializadorErro(res.getHeader('Content-Type'))
    res.send(serializador.serializar({mensagem: err.message, id: err.idErro}))

})



app.listen(config.get('api.porta'), () => {
    console.log('api rodando')
})

