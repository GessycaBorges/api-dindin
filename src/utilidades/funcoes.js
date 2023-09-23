const {
    erroServidor,
    erroAutenticacao,
    erroValidacaoDados
} = require('../servicos/mensagens');
const pool = require('../conexao');

const bcrypt = require('bcrypt');
const senhaJwt = require('../senhaJwt');
const jwt = require('jsonwebtoken');

//const autenticarUsuario = async (req, res) => {
//    const { authorization } = req.headers;
//   
//    if (!authorization) {
//        return res.status(401).json(erroAutenticacao[0]);
//    };
//}

const validarEmail = (email) => {
    let emailValido = true;

    if (email.indexOf("@") < 0 || email.indexOf(".") < 0 || email.indexOf(".") === 0 ||
        email.lastIndexOf(".") === email.length - 1 || email.trim() === '') { 
        emailValido = false;
        return emailValido;
    }

    if (emailValido){
        return email.trim()
    }
}

const validarDadosUsuario = async (req) => {
    const { nome, email, senha } = req.body;
    let dadosNaoInformados = false;
    let dadosIncompletos = false;

    if (!nome || !email || !senha) {
        dadosNaoInformados = true;
    }

    if (nome.length < 3 || senha.length < 6 ) {
        dadosIncompletos = true;
    }

    if (!dadosIncompletos && !dadosNaoInformados) {
        const emailVerificado = validarEmail(email);
        return { nome, emailVerificado, senha };
    }

    return { dadosNaoInformados, dadosIncompletos}
}

const validarDadosLogin = async (req) => {
    const { email, senha } = req.body;
    let dadosNaoInformados = false;

    if (!email || !senha) {
        dadosNaoInformados = true;
        return dadosNaoInformados;
    }

    return { email, senha };
}

const criarToken = async (rows, senha ) => {
    const { senha: senhaUsuario, ...usuario } = rows[0]; 

    const senhaValida = await bcrypt.compare(senha, senhaUsuario);

    if (!senhaValida) {
        return senhaValida;
    };

    const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' });

    return { usuario, token };
}


module.exports = {
    validarDadosUsuario,
    validarDadosLogin,
    criarToken
}