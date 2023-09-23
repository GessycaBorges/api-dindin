const pool = require('../conexao');
const { erroAutenticacao } = require('../servicos/mensagens');

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
        return res.status(401).json(erroAutenticacao[1]);
    };

    return rows;
}

const emailExiste = async (email) => {
    const emailExiste = await pool.query(
        'select * from usuarios where email = $1',
        [email]
    );

    return emailExiste;
}

const novoUsuario = async (nome, email, senhaCriptografada) => {
    const novoUsuario = await pool.query(
        'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *',
        [nome, email, senhaCriptografada]
    );

    const { senha: _, ...usuario } = novoUsuario.rows[0];

    return usuario;
}

module.exports = {
    selecionarCategorias,
    selecionarUsuariosId,
    emailExiste,
    novoUsuario
}