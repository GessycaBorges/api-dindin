const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');
const erroAutenticacao = require('../servicos/mensagens');
const { selecionarUsuariosId } = require('../servicos/querys');


const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers;

    try {
        const token = authorization.split(' ')[1];

        const { id } = jwt.verify(token, senhaJwt);

        const rows = await selecionarUsuariosId(id, res);

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json(erroAutenticacao[0]);
    };
}

module.exports = verificarUsuarioLogado;