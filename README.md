<img src='./ativos/imagens/dindin.jpg'>

<h1 align="center"> 
	Desafio - Módulo 03 - Back-end
</h1>

<p align="center">
	<img alt="Status Concluído" src="https://img.shields.io/badge/STATUS-CONCLU%C3%8DDO-brightgreen">
</p>

## 💻 Sobre o projeto

📄 A proposta do desafio do módulo 03 do curso de Desenvolvimento de Software com Foco em Back-end da Cubos Academy é criar uma RESTful API para auxiliar no controle financeiro.

---
## ⚙️ Funcionalidades

<ul>
<li>Cadastrar usuário;</li>
<li>Fazer login;</li>
<li>Detalhar o perfil do usuário logado; </li>
<li>Atualizar o perfil do usuário logado;</li>
<li>Listar categorias;</li>
<li>Cadastrar uma nova transação;</li>
<li>Atualizar a transação;</li>
<li>Detalhar transação;</li>
<li>Listar transações e filtrar as transações por categoria;</li>
<li>Excluir transação;</li>
<li>Emitir extrato de transações.
</li> </ul>

---

## 🛣️ Como executar o projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Além disto é bom ter um editor para trabalhar com o código como o [VS Code](https://code.visualstudio.com/)

#### 🎲 Rodando o Backend (servidor)

```bash

# Clone este repositório
$ git clone git@github.com:JulianaT93/desafio-backend-m03-b2bt05.git

# Acesse a pasta do projeto no terminal/cmd
$ cd desafio-backend-m03-b2bt05

# Instale as dependências
$ npm install express pg bcrypt jsonwebtoken

$ npm install -D nodemon

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor inciará na porta:3000 - acesse http://localhost:3000 

```
---
## 👩‍💻 Exemplo


#### 📌Cadastrar usuário
#### `POST` `/usuario`

> Essa é a rota que será utilizada para cadastrar um novo usuário no sistema.

Requisitos para os dados de cadastro:
- Todos os dados precisam ser informados (nome, email e senha);
- O nome deve conter no mínimo 3 caracteres;
- O email precisa ser um e-mail válido e só pode ser cadastrado uma vez;
- A senha deve conter no mínimo 6 caracteres;

<img src='./ativos/imagens/01 - Cadastrar Usuario.png' width ='1000'>

#### 📌Login do usuário
#### `POST` `/login`

> Essa é a rota que permite ao usuário cadastrado realizar o login no sistema.

Requisitos para os dados de login:
- Todos os dados precisam ser informados (email e senha);

<img src='./ativos/imagens/02 - Login Usuario.png' width ='1000'>

#### ⚠️ATENÇÃO: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, deverão exigir o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token.

#### 📌Detalhar usuário
#### `GET` `/usuario`

> Essa é a rota que será chamada quando o usuário quiser obter os dados do seu próprio perfil.

<img src='./ativos/imagens/03 - Detalhar Usuario.png' width ='1000'>

#### 📌Atualizar usuário
#### `PUT` `/usuario`

> Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio cadastro.

Requisitos para os dados de atualização:
- Todos os dados precisam ser informados (nome, email e senha);
- O nome deve conter no mínimo 3 caracteres;
- O email precisa ser um e-mail válido e não pode estar cadastrado para outros usuários;
- A senha deve conter no mínimo 6 caracteres;

<img src='./ativos/imagens/01 - Cadastrar Usuario.png' width ='1000'>

#### 📌Listar categorias
#### `GET` `/categoria`

> Essa é a rota que será chamada quando o usuário logado quiser listar todas as categorias cadastradas.

<img src='./ativos/imagens/05 - Listar Categorias.png' width ='1000'>

#### 📌Listar transações do usuário logado
#### `GET` `/transacao`

> Essa é a rota que será chamada quando o usuário logado quiser listar todas as suas transações cadastradas.

<img src='./ativos/imagens/06 - Listar Transaçoes.png' width ='1000'>

#### 📌Filtrar transações por categoria
#### `GET` `/transacao`

> Essa é a rota que será chamada quando o usuário logado quiser listar todas as suas transações cadastradas filtrando pelo nome da categoria.

Requisitos para os filtrar transações:
- Incluir um parâmetro do tipo query filtro para que seja possível consultar apenas transações das categorias informadas;

<img src='./ativos/imagens/06.1 - Listar Transaçoes com Filtro.png' width ='1000'>

#### 📌Detalhar uma transação do usuário logado
#### `GET` `/transacao/:id`

> Essa é a rota que será chamada quando o usuário logado quiser obter uma das suas transações cadastradas.

<img src='./ativos/imagens/07 - Detalhar Transaçao.png' width ='1000'>


#### 📌Cadastrar transação para o usuário logado
#### `POST` `/transacao`

> Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.

Requisitos para cadastro de transação:
- Todos os dados precisam ser informados (descricao, valor, data, categoria_id e tipo);
- O tipo deverá ser 'saida' ou 'entrada';

<img src='./ativos/imagens/08 - Cadastrar Transaçao.png' width ='1000'>

#### 📌Atualizar transação do usuário logado
#### `PUT` `/transacao/:id`

> Essa é a rota que será chamada quando o usuário logado quiser atualizar uma das suas transações cadastradas.

Requisitos para cadastro de atualização:
- Todos os dados precisam ser informados (descricao, valor, data, categoria_id e tipo);
- O tipo deverá ser 'saida' ou 'entrada';

<img src='./ativos/imagens/09 - Atualizar Transaçao.png' width ='1000'>

#### 📌Excluir transação do usuário logado
#### `DELETE` `/transacao/:id`

>Essa é a rota que será chamada quando o usuário logado quiser excluir uma das suas transações cadastradas.

<img src='./ativos/imagens/10 - Excluir Transaçao.png' width ='1000'>

#### 📌Obter extrato de transações
#### `GET` `/transacao/extrato`

> Essa é a rota que será chamada quando o usuário logado quiser obter o extrato de todas as suas transações cadastradas.

<img src='./ativos/imagens/11 - Extrato.png' width ='1000'>







---
## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:


#### [](https://github.com/JulianaT93/22-desafio-backend-m02-b2bt05)**Server**  ([NodeJS](https://nodejs.org/en/))

-   **[Express](https://expressjs.com/)**
-   **[Node-Postgres](https://node-postgres.com/)**
-   **[Bcrypt](https://www.npmjs.com/package/bcrypt)**
-   **[JSON Web Token](https://jwt.io/)**
-   **[Nodemon](https://nodemon.io/)**

> Veja o arquivo  [package.json](https://github.com/JulianaT93/desafio-backend-m03-b2bt05/blob/main/package.json)

**Utilitários**

-   Editor:  **[Visual Studio Code](https://code.visualstudio.com/)**
-   Teste de API:  **[Postman](https://www.postman.com/)**

> Veja o arquivo  [teste-api-rotas-postman.json](https://github.com/JulianaT93/desafio-backend-m03-b2bt05/blob/main/teste-api-rotas-postman.json)

---

Feito com ❤️ por **[Gessyca](https://www.linkedin.com/in/gessycaborges/)** e **[Juliana](https://www.linkedin.com/in/juliana-toguti/)**
