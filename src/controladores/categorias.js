const selecionarCategorias = require('../servicos/consultas-categorias');
const erroServidor = require('../servicos/mensagens');

const listarCategorias = async (req, res) => {
    try {
        const { rows } = await selecionarCategorias(req);

        return res.json(rows);
    } catch (error) {
        return res.status(500).json(erroServidor);
    };
};

module.exports = listarCategorias;