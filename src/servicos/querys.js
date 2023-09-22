const pool = require('../conexao');
const mensagemErro = require('../servicos/mensagens');

const selecionarCategorias = async (req, res) => {
    const { rows } = await pool.query(
        'select * from categorias'
    );

    return res.json(rows);
}

const selecionarUsuariosId = async (id, res) => {
    const { rows, rowCount } = await pool.query(
        'select * from usuarios where id = $1', [id]
    );

    if (rowCount < 1) {
        return res.status(401).json(mensagemErro[2]);
    };

    return rows;
}

const emailExiste = async (email, res) => {
    const { rowCount } = await pool.query(
        'select * from usuarios where email = $1',
        [email]
    );

    if (rowCount > 0) {
        return res.status(400).json(mensagemErro[4])
    };

    return email;
}

module.exports = {
    selecionarCategorias,
    selecionarUsuariosId,
    emailExiste
}