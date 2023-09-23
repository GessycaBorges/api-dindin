const erroServidor = { mensagem: 'Erro interno do servidor' }

const erroAutenticacao = [
    { mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' },
    { mensagem: 'Não autorizado' }
]

const erroValidacaoDados = [
    { mensagem: 'Todos os campos são obrigatórios' },
    { mensagem: 'Já existe usuário cadastrado com o e-mail informado' },
    { mensagem: 'Dados inválidos' }
]

module.exports = {
    erroServidor,
    erroAutenticacao,
    erroValidacaoDados
}