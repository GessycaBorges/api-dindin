const { autenticarUsuario, validarDadosUsuario, validarDadosLogin, criarToken } = require('../utilidades/funcoes');
const { emailExiste, novoUsuario } = require('../servicos/querys');
const {
    erroServidor,
    erroAutenticacao,
    erroValidacaoDados
} = require('../servicos/mensagens');
const bcrypt = require('bcrypt');
const pool = require('../conexao');
const senhaJwt = require('../senhaJwt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    try {
        const validacao = await validarDadosUsuario(req);

        if (validacao.dadosNaoInformados){
            return res.status(400).json(erroValidacaoDados[0]);
        }

        if (validacao.dadosIncompletos || !validacao.emailVerificado){
            return res.status(400).json(erroValidacaoDados[2]);
        }

        const { rowCount } = await emailExiste(validacao.emailVerificado, res);

        if (rowCount > 0) {
            return res.status(400).json(erroValidacaoDados[1])
        };

        const senhaCriptografada = await bcrypt.hash(validacao.senha, 10);

        const usuario = await novoUsuario(validacao.nome, validacao.emailVerificado, senhaCriptografada);

        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(500).json(erroServidor);
    }
}

const login = async (req, res) => {
    //PROBLEMA NOS ERROS
    try {
        const validacao = await validarDadosLogin(req)

        if (validacao.dadosNaoInformados === true){
            return res.status(400).json(erroValidacaoDados[0]);
        }

        const { rowCount, rows } = await emailExiste(validacao.email, res);

        if (rowCount < 1) {
            return res.status(400).json(erroValidacaoDados[2]);
        };
     
        const validacaoToken = await criarToken(rows, validacao.senha);

        if (!validacaoToken) {
            return res.status(400).json(erroValidacaoDados[2]);
        };

        return res.json({ usuario: validacaoToken.usuario, token: validacaoToken.token })
    } catch (error) {
        return res.status(500).json(erroServidor);
    };
}

const detalharUsuario = async (req, res) => {
    try {
        //await autenticarUsuario(req, res);

        return res.json(req.usuario);
    } catch (error) {
        return res.status(500).json(erroServidor);
    }
}

const atualizarUsuario = async (req, res) => {
    const { id } = req.usuario;

    const { nome, email, senha } = await validarDadosUsuario(req, res);

    try {
        const { rowCount } = await pool.query(
            'select * from usuarios where id = $1',
            [id]
        );

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado. Para acessar este recurso um token de autenticação válido deve ser enviado.' })
        };

        const emailExiste = await pool.query(
            'select * from usuarios where email = $1 and id != $2',
            [email, id]
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