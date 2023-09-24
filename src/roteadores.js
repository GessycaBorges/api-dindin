const express = require('express');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('./controladores/usuarios');
const verificarUsuarioLogado = require('./intermediarios/autenticacao');
const listarCategorias = require('./controladores/categorias');
const { listarTransacoes, obterExtrato, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao } = require('./controladores/transacoes');

const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);
rotas.get('/categoria', listarCategorias);
rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/extrato', obterExtrato);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = rotas;