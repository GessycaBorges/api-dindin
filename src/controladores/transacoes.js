const pool = require('../conexao');

const listarTransacoes = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };

    try {
        const query = `
        select t.id, t.tipo, t.descricao, t.valor, t.data,
        t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        from transacoes t left join categorias c 
        on t.categoria_id = c.id
        where t.usuario_id = $1
        `

        const { rows } = await pool.query(query, [req.usuario.id]);

        return res.json(rows);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

};

const detalharTransacao = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };

    const { id } = req.params;

    try {
        const { rows, rowCount } = await pool.query(`
        select t.id, t.tipo, t.descricao, t.valor, t.data,
        t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        from transacoes t left join categorias c 
        on t.categoria_id = c.id
        where t.id = $1 and t.usuario_id = $2;
        `,
        [id, req.usuario.id]
        );

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        };

        return res.json(rows[0]);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const cadastrarTransacao = async (req, res) => {
    const { authorization } = req.headers;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    try {
        const categoriaExiste = await pool.query(
            'select * from transacoes where id = $1',
            [categoria_id]
        );

        if (categoriaExiste.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada' })
        };

        if (tipo === "entrada" || tipo === "saida"){
            const { rows } = await pool.query(`
            insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
            values ($1, $2, $3, $4, $5, $6) returning *`,
            [tipo, descricao, valor, data, categoria_id, req.usuario.id]
            );
    
            console.log(rows)
    
            const categoria = await pool.query (`
            select descricao from categorias where id = $1
            `, [categoria_id])
    
    
            const novaTransacao = rows.map(transacao => {
                const { id, tipo, descricao, valor, data, usuario_id, categoria_id } = transacao;
    
                return {
                    id,
                    tipo,
                    descricao,
                    valor,
                    data,
                    usuario_id,
                    categoria_id,
                    categoria_nome: categoria.rows[0].descricao
                }
            });
    
            return res.status(201).json(novaTransacao)
        };
        
        return res.status(400).json({ mensagem: 'Tipo de transação inválido' })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const atualizarTransacao = async (req, res) => {

}

const excluirTransacao = async (req, res) => {

}

const obterExtrato = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };

    try {
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
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