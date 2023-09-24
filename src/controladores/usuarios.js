const { validarEmail, criarToken } = require('../utilidades/funcoes-usuarios');
const { emailExiste, novoUsuario, emailExisteParaOutrosUsuarios, usuarioAtualizado } = require('../servicos/consultas-usuarios');
const { erroServidor, erroValidacaoDados } = require('../servicos/mensagens');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json(erroValidacaoDados[0]);
    };

    const emailVerificado = await validarEmail(email);

    if (nome.length < 3 || nome.trim() === '' || senha.length < 6 || senha.trim() === '' || !emailVerificado) {
        return res.status(400).json(erroValidacaoDados[2]);
    };

    try {
        const { rowCount } = await emailExiste(emailVerificado, res);

        if (rowCount > 0) {
            return res.status(400).json(erroValidacaoDados[1])
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await novoUsuario(nome, emailVerificado, senhaCriptografada);

        return res.status(201).json(usuario);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(erroServidor);
    };
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json(erroValidacaoDados[0]);
    };

    try {
        const { rowCount, rows } = await emailExiste(email);

        if (rowCount < 1) {
            return res.status(400).json(erroValidacaoDados[2]);
        };

        const validacaoToken = await criarToken(rows, senha);

        if (!validacaoToken) {
            return res.status(400).json(erroValidacaoDados[2]);
        };

        return res.json({ usuario: validacaoToken.usuario, token: validacaoToken.token });
    } catch (error) {
        return res.status(500).json(erroServidor);
    };
};

const detalharUsuario = async (req, res) => {
    try {
        return res.json(req.usuario);
    } catch (error) {
        return res.status(500).json(erroServidor);
    };
};

const atualizarUsuario = async (req, res) => {
    const { id } = req.usuario;
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json(erroValidacaoDados[0]);
    };

    const emailVerificado = await validarEmail(email);

    if (nome.length < 3 || nome.trim() === '' || senha.length < 6 || senha.trim() === '' || !emailVerificado) {
        return res.status(400).json(erroValidacaoDados[2]);
    };

    try {
        const { rowCount } = await emailExisteParaOutrosUsuarios(emailVerificado, id)

        if (rowCount > 0) {
            return res.status(400).json(erroValidacaoDados[1]);
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await usuarioAtualizado(nome, emailVerificado, senhaCriptografada, id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json(erroServidor);
    };
};

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
};