const express = require('express');
//const { } = require('./controladores/transacoes');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('./controladores/usuarios');
const verificarUsuarioLogado = require('./intermediarios/autenticacao');


const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharUsuario); //! Detalhar usuário
rotas.put('/usuario', atualizarUsuario); //! Atualizar usuário
rotas.get('/categoria'); //! Listar categoria
rotas.get('/transacao'); //! Listar transações do usuário logado
rotas.get('/transacao/:id'); //! Detalhar uma transação do usuário logado
rotas.post('/transacao'); //! Cadastrar transação para o usuário logado
rotas.put('/transacao/:id'); //! Atualizar transação do usuário logado
rotas.delete('/transacao/:id'); //! Excluir transação do usuário logado
rotas.get('/transacao/extrato'); //! Obter extrato de transações

module.exports = rotas;