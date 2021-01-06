const modelos = [
    require('../rotas/fornecedores/ModeloTabelaFornecedor'),
    require('../rotas/fornecedores/produtos/ModeloTabelaProduto')
]


const criarTabelas = async () => {
    for (let cont = 0; cont < modelos.length; cont++){
        const modelo = modelos[cont]
        await modelo.sync()
    }
}

criarTabelas()