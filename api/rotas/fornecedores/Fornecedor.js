const TabelaFornecedor = require('./TabelaFornecedor')
const CampoInvalido = require('../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')


class Fornecedor {
    constructor ({id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao}) {
        this.id = id
        this.empresa = empresa
        this.email = email
        this.categoria = categoria
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    async criar() {
        this.validar()
        const result = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria,

        })

        this.id = result.id
        this.dataCriacao = result.dataCriacao
        this.dataAtualizacao = result.dataAtualizacao
        this.versao = result.versao
    }

    async carregar() {
        const result = await TabelaFornecedor.pegarPorId(this.id)
        this.empresa = result.empresa
        this.email = result.email
        this.categoria = result.categoria
        this.dataCriacao = result.dataCriacao
        this.dataAtualizacao = result.dataAtualizacao
        this.versao = result.versao
    }

    async atualizar() {
        await TabelaFornecedor.pegarPorId(this.id)
        const campos = ['empresa','email','categoria']
        const dadosParaAtualizar = {}
        
        campos.forEach((campo) => {
            const valor = this[campo]
            if(typeof valor === 'string' && valor.length > 0){
                dadosParaAtualizar[campo] = valor
            }
        })

        if(Object.keys(dadosParaAtualizar).length === 0){
            throw new DadosNaoFornecidos()
        }

        await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar)
    }

    async deletar() {
        return TabelaFornecedor.remover(this.id)
    }

    validar () {
        const campos = ['empresa', 'email', 'categoria']
        
        campos.forEach((campo) => {
            const valor = this[campo]
            if(typeof valor !== 'string' || valor.length === 0){
                throw new CampoInvalido(campo)
            }
        })
    }
}


module.exports = Fornecedor