const { erroTransacao, erroServidor, erroValidacaoDados } = require('../servicos/mensagens');
const { exibirTransacaoCadastrada, verificarDados, consultarExtrato } = require('../utilidades/funcoes-transacoes');
const { buscarTransacoes, transacaoDetalhada, verificarCategoria, verificarTransacao, transacaoCadastrada, transacaoAtualizada, transacaoExcluida, obterTransacoes, filtroCategorias } = require('../servicos/consultas-transacoes');

const listarTransacoes = async (req, res) => {
    const { filtro } = req.query;
    const { id } = req.usuario;

    try {
        if (filtro) {
            const transacoes = await filtroCategorias(id, filtro);

            return res.json(transacoes);
        }

        const rows = await buscarTransacoes(req);

        return res.json(rows);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(erroServidor);
    };
};

const detalharTransacao = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows, rowCount } = await transacaoDetalhada(req, id);

        if (rowCount < 1) {
            return res.status(404).json(erroTransacao[0]);
        };

        return res.json(rows[0]);
    } catch (error) {
        return res.status(500).json(erroServidor);
    };
};

const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    const dadosNaoInformados = verificarDados(tipo, descricao, valor, data, categoria_id);

    if (dadosNaoInformados) {
        return res.status(400).json(erroValidacaoDados[0]);
    };

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

        const { rows } = await transacaoCadastrada(tipo, descricao, valor, data, categoria_id, req);

        const categoria = await verificarCategoria(categoria_id);

        const novaTransacao = await exibirTransacaoCadastrada(rows, categoria);

        return res.status(201).json(novaTransacao);
    } catch (error) {
        return res.status(500).json(erroServidor);
    };
};

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

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
    };
};

const excluirTransacao = async (req, res) => {
    const { id } = req.params;

    try {
        const transacaoExiste = await verificarTransacao(id);

        if (transacaoExiste.rowCount < 1) {
            return res.status(400).json(erroTransacao[0]);
        };

        await transacaoExcluida(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json(erroServidor);
    };
};

const obterExtrato = async (req, res) => {
    const id = req.usuario.id;

    try {
        const { obterEntrada, obterSaida } = await obterTransacoes(id);

        const extrato = await consultarExtrato(obterEntrada, obterSaida);

        return res.json(extrato);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(erroServidor);
    };
};

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato
};