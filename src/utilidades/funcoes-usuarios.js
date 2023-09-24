const bcrypt = require('bcrypt');
const senhaJwt = require('../senhaJwt');
const jwt = require('jsonwebtoken');

const validarEmail = (email) => {
    let emailValido = true;

    if (email.indexOf("@") < 0 || email.indexOf(".") < 0 || email.indexOf(".") === 0 ||
        email.lastIndexOf(".") === email.length - 1 || email.trim() === '') {
        emailValido = false;
        return emailValido;
    };

    if (emailValido) {
        return email.trim();
    };
};

const criarToken = async (rows, senha) => {
    const { senha: senhaUsuario, ...usuario } = rows[0];

    const senhaValida = await bcrypt.compare(senha, senhaUsuario);

    if (!senhaValida) {
        return senhaValida;
    };

    const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' });

    return { usuario, token };
};

module.exports = {
    validarEmail,
    criarToken
};