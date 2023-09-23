const pool = require('../conexao');
const { erroAutenticacao } = require('../servicos/mensagens');

const selecionarCategorias = async (req, res) => {
    const { rows } = await pool.query(
        'select * from categorias'
    );

    return res.json(rows);
}

const selecionarUsuariosId = async (id) => {
    const { rows, rowCount } = await pool.query(
        'select * from usuarios where id = $1', [id]
    );

    return { rows, rowCount };
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

//Alterações a partir daqui
const buscarTransacoes = async (req) => {
    const query =
        `
        select t.id, t.tipo, t.descricao, t.valor, t.data,
        t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        from transacoes t left join categorias c 
        on t.categoria_id = c.id
        where t.usuario_id = $1
    `;

    const { rows } = await pool.query(query, [req.usuario.id]);

    return rows;
}

const transacaoDetalhada = async (req, id) => {
    const { rows, rowCount } = await pool.query(
        `
        select t.id, t.tipo, t.descricao, t.valor, t.data,
        t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        from transacoes t left join categorias c 
        on t.categoria_id = c.id
        where t.id = $1 and t.usuario_id = $2;
    `,
        [id, req.usuario.id]
    );

    return { rows, rowCount };
}

const verificarCategoria = async (categoria_id) => {
    const categoriaExiste = await pool.query(
        'select * from categorias where id = $1',
        [categoria_id]
    );

    return categoriaExiste;
}

const verificarTransacao = async (id) => {
    const transacaoExiste = await pool.query(
        'select * from transacoes where id = $1',
        [id]
    )

    return transacaoExiste;
}

const transacaoCadastrada = async (tipo, descricao, valor, data, categoria_id, req) => {
    const { rows } = await pool.query(
        `
        insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
        values ($1, $2, $3, $4, $5, $6) returning *`
        ,
        [tipo, descricao, valor, data, categoria_id, req.usuario.id]
    );

    return { rows };
}

const transacaoAtualizada = async (tipo, descricao, valor, data, categoria_id, id) => {
    await pool.query(
        `
        update transacoes
        set tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5
        where id = $6`
        ,
        [tipo, descricao, valor, data, categoria_id, id]
    );
}

const transacaoExcluida = async (id) => {
    await pool.query('delete from transacoes where id = $1', [id])
}

const obterTransacoes = async (id) => {
    const obterEntrada = await pool.query(
        `
        select sum(valor) from transacoes where tipo = 'entrada' and usuario_id = $1`
        ,
        [id]
    );

    const obterSaida = await pool.query(
        `
        select sum(valor) from transacoes where tipo = 'saida' and usuario_id = $1`
        ,
        [id]
    );

    return { obterEntrada, obterSaida }
}

module.exports = {
    selecionarCategorias,
    selecionarUsuariosId,
    emailExiste,
    novoUsuario,
    buscarTransacoes,
    transacaoDetalhada,
    verificarCategoria,
    verificarTransacao,
    transacaoCadastrada,
    transacaoAtualizada,
    transacaoExcluida,
    obterTransacoes
}