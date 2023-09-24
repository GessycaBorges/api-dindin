const pool = require('../conexao');

const selecionarUsuariosId = async (id) => {
    const { rows, rowCount } = await pool.query(`
        SELECT * FROM usuarios WHERE id = $1;
        `, [id]
    );

    return { rows, rowCount };
};

const emailExiste = async (email) => {
    const emailExiste = await pool.query(`
        SELECT * FROM usuarios WHERE email = $1;
        `, [email]
    );

    return emailExiste;
};

const emailExisteParaOutrosUsuarios = async (email, id) => {
    const { rowCount } = await pool.query(`
        SELECT * FROM usuarios WHERE email = $1 and id != $2;
        `, [email, id]
    );

    return { rowCount };
};

const novoUsuario = async (nome, email, senhaCriptografada) => {
    const { rows } = await pool.query(`
        INSERT INTO usuarios (nome, email, senha) 
        VALUES ($1, $2, $3) RETURNING *;
        `, [nome, email, senhaCriptografada]
    );

    const { senha: _, ...usuario } = rows[0];

    return usuario;
};

const usuarioAtualizado = async (nome, email, senhaCriptografada, id) => {
    await pool.query(`
        UPDATE usuarios SET nome = $1, email = $2, senha = $3 
        WHERE id = $4;
        `, [nome, email, senhaCriptografada, id]
    );
};

module.exports = {
    selecionarUsuariosId,
    emailExiste,
    emailExisteParaOutrosUsuarios,
    novoUsuario,
    usuarioAtualizado
};