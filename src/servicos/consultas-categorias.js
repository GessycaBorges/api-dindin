const pool = require('../conexao');

const selecionarCategorias = async (req) => {
    const { rows } = await pool.query(`
    SELECT * FROM categorias;
    `);

    return { rows };
};

module.exports = selecionarCategorias;