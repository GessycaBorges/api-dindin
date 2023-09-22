const mensagemErro = require('../servicos/mensagens');
const pool = require('../conexao');

const autenticarUsuario = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json(mensagemErro[2]);
    };
}

const validarDadosUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json(mensagemErro[3])
    }

    return { nome, email, senha };
}

const validarDadosLogin = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json(mensagemErro[3])
    }

    return { email, senha };
}





module.exports = {
    autenticarUsuario,
    validarDadosUsuario,
    validarDadosLogin
}