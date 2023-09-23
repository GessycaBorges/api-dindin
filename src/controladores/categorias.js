const { selecionarCategorias } = require('../servicos/querys');
const { autenticarUsuario } = require('../utilidades/funcoes-usuarios');
const mensagemErro = require('../servicos/mensagens');

const listarCategorias = async (req, res) => {
    await autenticarUsuario(req, res);

    try {
        await selecionarCategorias(req, res);
    } catch (error) {
        return res.status(500).json(mensagemErro[0]);
    }
}

module.exports = listarCategorias;