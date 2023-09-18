-- Criar banco de dados chamado dindin:
create database dindin;

-- Criar a entidade usuarios:
create table usuarios (
	id serial primary key unique,
  nome text not null,
  email text not null unique,
  senha text not null
);

-- Criar a entidade categorias:
create table categorias (
	id serial primary key unique,
	descricao text not null
 );
 
 -- Criar a entidade transacoes:
create table transacoes (
	id serial primary key unique,
	descricao text not null,
	valor integer not null,
	data date not null,
	categoria_id integer not null references categorias (id),
	usuario_id integer not null references usuarios (id),
	tipo text not null
);

-- Cadastrar categorias na entidade categorias:
insert into categorias (descricao) values ('Alimentação');
insert into categorias (descricao) values ('Assinaturas e Serviços');
insert into categorias (descricao) values ('Casa');
insert into categorias (descricao) values ('Mercado');
insert into categorias (descricao) values ('Cuidados Pessoais');
insert into categorias (descricao) values ('Educação');
insert into categorias (descricao) values ('Família');
insert into categorias (descricao) values ('Lazer');
insert into categorias (descricao) values ('Pets');
insert into categorias (descricao) values ('Presentes');
insert into categorias (descricao) values ('Roupas');
insert into categorias (descricao) values ('Saúde');
insert into categorias (descricao) values ('Transporte');
insert into categorias (descricao) values ('Salário');
insert into categorias (descricao) values ('Vendas');
insert into categorias (descricao) values ('Outras receitas');
insert into categorias (descricao) values ('Outras despesas');