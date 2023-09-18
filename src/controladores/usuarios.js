const bcrypt = require('bcrypt');
const pool = require('../conexao');
const senhaJwt = require('../senhaJwt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    try {
        const emailExiste = await pool.query(
            'select * from usuarios where email = $1',
            [email]
        );

        if (emailExiste.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado' })
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(
            'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *',
            [nome, email, senhaCriptografada]
        );

        const { senha: _, ...usuario } = novoUsuario.rows[0];

        return res.status(201).json(usuario)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    try {
        const { rows, rowCount } = await pool.query(
            'select * from usuarios where email = $1',
            [email]
        ); // Desestruturação para puxar do banco a linha com a informação e a quantidade de linhas

        if (rowCount < 1) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
        };

        const { senha: senhaUsuario, ...usuario } = rows[0]; // Desestruturação para pegar do banco o hash da senha criptografada e o spread operator

        const senhaValida = await bcrypt.compare(senha, senhaUsuario);

        if (!senhaValida) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
        };

        const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' });

        return res.json({ usuario, token })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    };
}

const detalharUsuario = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    };

    return res.json(req.usuario);
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }

    try {
        const { rowCount } = await pool.query(
            'select * from usuarios where id = $1',
            [id]
        );

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado. Para acessar este recurso um token de autenticação válido deve ser enviado.' })
        };

        const emailExiste = await pool.query(
            'select * from usuarios where email = $1',
            [email]
        );

        if (emailExiste.rowCount > 0) {
            return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário' })
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryAtualizarUsuario = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4';

        await pool.query(queryAtualizarUsuario, [nome, email, senhaCriptografada, id]);

        return res.status(204).send();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
}