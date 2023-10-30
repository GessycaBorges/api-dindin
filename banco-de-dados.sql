CREATE DATABASE dindin;

CREATE TABLE usuarios (
	id serial primary key unique,
  nome text not null,
  email text not null unique,
  senha text not null
);

CREATE TABLE categorias (
	id serial primary key unique,
	descricao text not null
 );
 
CREATE TABLE transacoes (
	id serial primary key unique,
	descricao text not null,
	valor integer not null,
	data date not null,
	categoria_id integer not null references categorias (id),
	usuario_id integer not null references usuarios (id),
	tipo text not null
);

INSERT INTO categorias (descricao) 
values
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');