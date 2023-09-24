const pool = require('../conexao');

const buscarTransacoes = async (req) => {
    const { rows } = await pool.query(`
        SELECT t.id, t.tipo, t.descricao, t.valor, t.data,
        t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        FROM transacoes t LEFT JOIN categorias c 
        on t.categoria_id = c.id
        WHERE t.usuario_id = $1;
        `, [req.usuario.id]
    );

    return rows;
};

const filtroCategorias = async (id, filtro) => {
    let transacoesFiltradas = [];

    for (transacao of filtro) {
        const { rows, rowCount } = await pool.query(`
        SELECT t.id, t.tipo, t.descricao, t.valor, t.data,
        t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        FROM transacoes t LEFT JOIN categorias c 
        on t.categoria_id = c.id
        WHERE t.usuario_id = $1 AND c.descricao = $2;
        `, [id, transacao]
        );

        if (rowCount === 1) {
            transacoesFiltradas.push(rows[0]);
        } else if (rowCount > 1) {
            transacoesFiltradas.push(...rows);
        }
    };
    return transacoesFiltradas;
};

const transacaoDetalhada = async (req, id) => {
    const { rows, rowCount } = await pool.query(`
        SELECT t.id, t.tipo, t.descricao, t.valor, t.data,
        t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        FROM transacoes t LEFT JOIN categorias c 
        on t.categoria_id = c.id
        WHERE t.id = $1 and t.usuario_id = $2;
        `, [id, req.usuario.id]
    );

    return { rows, rowCount };
};

const verificarCategoria = async (categoria_id) => {
    const categoriaExiste = await pool.query(`
        SELECT * FROM categorias WHERE id = $1;
        `, [categoria_id]
    );

    return categoriaExiste;
};

const verificarTransacao = async (id) => {
    const transacaoExiste = await pool.query(`
        SELECT * FROM transacoes WHERE id = $1;
        `, [id]
    );

    return transacaoExiste;
};

const transacaoCadastrada = async (tipo, descricao, valor, data, categoria_id, req) => {
    const { rows } = await pool.query(`
        INSERT INTO transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `, [tipo, descricao, valor, data, categoria_id, req.usuario.id]
    );

    return { rows };
};

const transacaoAtualizada = async (tipo, descricao, valor, data, categoria_id, id) => {
    await pool.query(`
        UPDATE transacoes
        SET tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5
        WHERE id = $6;
        `, [tipo, descricao, valor, data, categoria_id, id]
    );
};

const transacaoExcluida = async (id) => {
    await pool.query(`
        DELETE FROM transacoes WHERE id = $1;
        `, [id]
    );
};

const obterTransacoes = async (id) => {
    const obterEntrada = await pool.query(`
        SELECT sum(valor) FROM transacoes WHERE tipo = 'entrada' and usuario_id = $1;
        `, [id]
    );

    const obterSaida = await pool.query(`
        SELECT sum(valor) FROM transacoes WHERE tipo = 'saida' and usuario_id = $1;
        `, [id]
    );

    return { obterEntrada, obterSaida }
};

module.exports = {
    buscarTransacoes,
    transacaoDetalhada,
    verificarCategoria,
    verificarTransacao,
    transacaoCadastrada,
    transacaoAtualizada,
    transacaoExcluida,
    obterTransacoes,
    filtroCategorias
};