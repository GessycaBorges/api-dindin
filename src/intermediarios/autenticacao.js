const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');
const { erroServidor, erroAutenticacao } = require('../servicos/mensagens');
const { selecionarUsuariosId } = require('../servicos/querys');


const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json(erroAutenticacao[0]);
    };

    const token = authorization.split(' ')[1];

    try {

        const { id } = jwt.verify(token, senhaJwt);

        const { rows, rowCount } = await selecionarUsuariosId(id);

        if (rowCount < 1) {
            return res.status(401).json(erroAutenticacao[1]);
        };

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        if (error.message === "invalid token") {
            return res.status(401).json(erroAutenticacao[0]);
        } else {
            console.log(error.message);
            return res.status(500).json(erroServidor);
        }
    };
}

module.exports = verificarUsuarioLogado;