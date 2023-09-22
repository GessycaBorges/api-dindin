![](https://i.imgur.com/xG74tOh.png)

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


Exemplo de tela usando o Postman para a listar as contas existentes no banco de dados.

<img src='./assets/exemplo-listar-contas.png' width ='1000'>

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
