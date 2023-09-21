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
            'select * from categorias where id = $1',
            [categoria_id]
        ); // estava puxando de transações e retornando que não existe. Troquei para categorias

        if (categoriaExiste.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada' })
        };

        if (tipo === "entrada" || tipo === "saida") {
            const { rows } = await pool.query(`
            insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
            values ($1, $2, $3, $4, $5, $6) returning *`,
                [tipo, descricao, valor, data, categoria_id, req.usuario.id]
            );

            const categoria = await pool.query(`
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
    const { authorization } = req.headers;
    //Id da transação deverá ser enviado no parâmetro da rota
    const { id } = req.params;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    //Validar se o token foi enviado
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };

    //Validar os campos obrigatórios
    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    try {
        //Validar se existe transação para esse id e se pertence ao usuario_ID (token)
        const categoriaExiste = await pool.query(
            'select * from categorias where id = $1',
            [categoria_id]
        );

        if (categoriaExiste.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada' })
        };

        //Validar se o tipo é “entrada” ou “saida” no body -- coloquei dois ifs, pq se for entrada ou saída ele passa
        if (tipo !== "entrada") {
            if (tipo !== "saida") {
                return res.status(400).json({ mensagem: 'Tipo de transação inválido' })
            }
        }

        //Atualizar transação
        const queryAtualizarTransacao = `
        update transacoes
        set tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5
        where id = $6`;

        await pool.query(queryAtualizarTransacao, [tipo, descricao, valor, data, categoria_id, id]);

        return res.status(204).send();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const excluirTransacao = async (req, res) => {
    const { authorization } = req.headers;
    //Id da transação deverá ser enviado no parâmetro da rota
    const { id } = req.params;

    //Validar se o token foi enviado
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };


    try {
        //Validar se existe transação para esse id e se pertence ao usuario_ID (token)
        const transacaoExiste = await pool.query(
            'select * from transacoes where id = $1',
            [id]
        )

        if (transacaoExiste < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        }

        //Excluir transação
        await pool.query('delete from transacoes where id = $1', [id])

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const obterExtrato = async (req, res) => {
    const { authorization } = req.headers;
    const { id } = req.usuario.id;
    //Validar se o token foi enviado
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };

    try {
        //Listar todas as transações
        const obterEntrada = await pool.query('select sum(valor) from transacoes where tipo = $1 and usuario_id = $2', ['entrada', id]);
        const obterSaida = await pool.query('select sum(valor) from transacoes where tipo = $3 and usuario_id = $4', ['saida', id]);

        console.log(id);
        console.log(obterEntrada);
        console.log(obterSaida);


        //Retornar a soma de todas as entradas e todas as saídas;
        const extrato = {
            entrada: obterEntrada.rows[0].sum,
            saida: obterSaida.rows[0].sum
        }
        return res.json(extrato)

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