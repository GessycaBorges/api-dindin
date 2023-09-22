const pool = require('../conexao');
const { autenticarUsuario } = require('../utilidades/funcoes');

const listarTransacoes = async (req, res) => {
    autenticarUsuario(req, res);

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
    autenticarUsuario(req, res);

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
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    autenticarUsuario(req, res);

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    try {
        const categoriaExiste = await pool.query(
            'select * from categorias where id = $1',
            [categoria_id]
        );

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
    const { id } = req.params;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    autenticarUsuario(req, res);

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    try {
        const categoriaExiste = await pool.query(
            'select * from categorias where id = $1',
            [categoria_id]
        );

        if (categoriaExiste.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Categoria não encontrada' })
        };

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
    const { id } = req.params;

    autenticarUsuario(req, res);

    try {
        const transacaoExiste = await pool.query(
            'select * from transacoes where id = $1',
            [id]
        )

        if (transacaoExiste < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        }

        await pool.query('delete from transacoes where id = $1', [id])

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const obterExtrato = async (req, res) => {
    const { id } = req.usuario;

    autenticarUsuario(req, res);

    try {
        const obterEntrada = await pool.query(`
        select sum(valor) from transacoes where tipo = 'entrada' and usuario_id = $1`,
            [id]);
        const obterSaida = await pool.query(`
        select sum(valor) from transacoes where tipo = 'saida' and usuario_id = $1`,
            [id]);

        console.log(obterEntrada.rows[0])

        let valorDeEntrada = obterEntrada.rows[0].sum
        if (!valorDeEntrada) {
            valorDeEntrada = '0';
        }

        let valorDeSaida = obterSaida.rows[0].sum
        if (!valorDeSaida) {
            valorDeSaida = '0';
        }

        const extrato = {
            entrada: valorDeEntrada,
            saida: valorDeSaida
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