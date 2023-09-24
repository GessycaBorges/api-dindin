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

INSERT INTO categorias (descricao) VALUES ('Alimentação');
INSERT INTO categorias (descricao) VALUES ('Assinaturas e Serviços');
INSERT INTO categorias (descricao) VALUES ('Casa');
INSERT INTO categorias (descricao) VALUES ('Mercado');
INSERT INTO categorias (descricao) VALUES ('Cuidados Pessoais');
INSERT INTO categorias (descricao) VALUES ('Educação');
INSERT INTO categorias (descricao) VALUES ('Família');
INSERT INTO categorias (descricao) VALUES ('Lazer');
INSERT INTO categorias (descricao) VALUES ('Pets');
INSERT INTO categorias (descricao) VALUES ('Presentes');
INSERT INTO categorias (descricao) VALUES ('Roupas');
INSERT INTO categorias (descricao) VALUES ('Saúde');
INSERT INTO categorias (descricao) VALUES ('Transporte');
INSERT INTO categorias (descricao) VALUES ('Salário');
INSERT INTO categorias (descricao) VALUES ('Vendas');
INSERT INTO categorias (descricao) VALUES ('Outras receitas');
INSERT INTO categorias (descricao) VALUES ('Outras despesas');