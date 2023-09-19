const express = require('express');
//const { } = require('./controladores/transacoes');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('./controladores/usuarios');
const verificarUsuarioLogado = require('./intermediarios/autenticacao');
const listarCategorias = require('./controladores/categorias');
const { listarTransacoes, obterExtrato, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao } = require('./controladores/transacoes');


const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharUsuario); //! Detalhar usuário
rotas.put('/usuario', atualizarUsuario); //! Atualizar usuário
rotas.get('/categoria', listarCategorias); //! Listar categoria
rotas.get('/transacao', listarTransacoes); //! Listar transações do usuário logado
rotas.get('/transacao/extrato', obterExtrato); //! Obter extrato de transações
rotas.get('/transacao/:id', detalharTransacao); //! Detalhar uma transação do usuário logado
rotas.post('/transacao', cadastrarTransacao); //! Cadastrar transação para o usuário logado
rotas.put('/transacao/:id', atualizarTransacao); //! Atualizar transação do usuário logado
rotas.delete('/transacao/:id', excluirTransacao); //! Excluir transação do usuário logado

module.exports = rotas;