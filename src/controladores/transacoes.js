const pool = require('../conexao');
const { erroTransacao, erroServidor, erroValidacaoDados } = require('../servicos/mensagens');
const {
    buscarTransacoes,
    transacaoDetalhada,
    verificarCategoria,
    verificarTransacao,
    transacaoCadastrada,
    transacaoAtualizada,
    transacaoExcluida,
    obterTransacoes
} = require('../servicos/querys');
const { exibirTransacaoCadastrada, verificarDados } = require('../utilidades/funcoes-transacoes');
const { autenticarUsuario } = require('../utilidades/funcoes-usuarios');

const listarTransacoes = async (req, res) => {
    autenticarUsuario(req, res);
    // PROBLEMA COM O ERRO DE AUTENTICACAO

    try {
        const rows = await buscarTransacoes(req);
        
        return res.json(rows);
    } catch (error) {
        return res.status(500).json(erroServidor);
    }
};

const detalharTransacao = async (req, res) => {
    autenticarUsuario(req, res);
    // PROBLEMA COM O ERRO DE AUTENTICACAO

    const { id } = req.params;

    try {
        const {rows, rowCount} = await transacaoDetalhada (req, id);

        if (rowCount < 1) {
            return res.status(404).json(erroTransacao[0]);
        };

        return res.json(rows[0]);
    } catch (error) {
        return res.status(500).json(erroServidor);
    }
}

const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    autenticarUsuario(req, res);
    // PROBLEMA COM O ERRO DE AUTENTICACAO

    const dadosNaoInformados = verificarDados(tipo, descricao, valor, data, categoria_id);

    if (dadosNaoInformados) {
        return res.status(400).json(erroValidacaoDados[0]);
    }

    try {
        const categoriaExiste = await verificarCategoria(categoria_id);

        if (categoriaExiste.rowCount < 1) {
            return res.status(400).json(erroTransacao[1]);
        };

        if (tipo !== "entrada") {
            if (tipo !== "saida") {
            return res.status(400).json(erroTransacao[2]);
            };
        }; 

        const { rows } = await transacaoCadastrada (tipo, descricao, valor, data, categoria_id, req);
        
        const categoria = await verificarCategoria(categoria_id);
        
        const novaTransacao = await exibirTransacaoCadastrada(rows, categoria);

        return res.status(201).json(novaTransacao);
    } catch (error) {
        return res.status(500).json(erroServidor);
    }
}

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    autenticarUsuario(req, res);

    const dadosNaoInformados = verificarDados(tipo, descricao, valor, data, categoria_id);

    if (dadosNaoInformados) {
        return res.status(400).json(erroValidacaoDados[0]);
    }

    try {
        const categoriaExiste = await verificarCategoria(categoria_id);

        if (categoriaExiste.rowCount < 1) {
            return res.status(400).json(erroTransacao[1]);
        };

        if (tipo !== "entrada") {
            if (tipo !== "saida") {
            return res.status(400).json(erroTransacao[2]);
            };
        }; 

        await transacaoAtualizada(tipo, descricao, valor, data, categoria_id, id);

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json(erroServidor);
    }
}

const excluirTransacao = async (req, res) => {
    const { id } = req.params;

    autenticarUsuario(req, res);

    try {
        const transacaoExiste = await verificarTransacao(id);

        if (transacaoExiste.rowCount < 1) {
            return res.status(400).json(erroTransacao[0]);
        };

        await transacaoExcluida(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json(erroServidor);
    }
}

const obterExtrato = async (req, res) => {
    const { id } = req.usuario;

    autenticarUsuario(req, res);

    try {
        const { obterEntrada, obterSaida } = await obterTransacoes(id);

        const extrato = await obterExtrato(obterEntrada, obterSaida);

        return res.json(extrato);
    } catch (error) {
        console.log (error.message)
        return res.status(500).json(erroServidor);
    }
}

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato
}