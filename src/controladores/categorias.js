const pool = require('../conexao');

const listarCategorias = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };

    try {
        const { rows } = await pool.query(
            'select * from categorias'
        );

        return res.json(rows);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

module.exports = listarCategorias;