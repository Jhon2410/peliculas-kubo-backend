-- jhon anderson;
-- drop database peliculas
create database peliculas;
use peliculas;

CREATE TABLE usuario (
  id_usuario int(10) NOT NULL AUTO_INCREMENT, 
  username   varchar(50) NOT NULL UNIQUE, 
  password   varchar(50) NOT NULL, 
  rol        char(1) NOT NULL, 
  PRIMARY KEY (id_usuario));
CREATE TABLE categorias (
  id_categoria     int(10) NOT NULL AUTO_INCREMENT, 
  nombre_categoria varchar(50) NOT NULL, 
  PRIMARY KEY (id_categoria));

CREATE TABLE peliculas (
  id_pelicula   int(10) NOT NULL AUTO_INCREMENT, 
  caratula    varchar(100) NOT NULL, 
  titulo        varchar(50) NOT NULL, 
  Descripcion   varchar(255) NOT NULL, 
  trailer       varchar(50) NOT NULL, 
  fecha_estreno date NOT NULL, 
  views         int(10) NOT NULL, 
  calificacion  int(10) NOT NULL, 
  duracion      varchar(10) NOT NULL, 
  PRIMARY KEY (id_pelicula));
CREATE TABLE categorias_peliculas (
  categoriasid_categoria int(10) NOT NULL, 
  peliculasid_pelicula   int(10) NOT NULL, 
  PRIMARY KEY (categoriasid_categoria, 
  peliculasid_pelicula));
CREATE TABLE peliculas_usuario_historial (
  peliculasid_pelicula int(10) NOT NULL, 
  usuarioid_usuario    int(10) NOT NULL, 
  visto varchar(3) NOT NULL, 
  calififacion int(1) NOT NULL,
  PRIMARY KEY (peliculasid_pelicula, 
  usuarioid_usuario));
ALTER TABLE categorias_peliculas ADD INDEX FKcategorias936921 (categoriasid_categoria), ADD CONSTRAINT FKcategorias936921 FOREIGN KEY (categoriasid_categoria) REFERENCES categorias (id_categoria);
ALTER TABLE categorias_peliculas ADD INDEX FKcategorias460841 (peliculasid_pelicula), ADD CONSTRAINT FKcategorias460841 FOREIGN KEY (peliculasid_pelicula) REFERENCES peliculas (id_pelicula);
ALTER TABLE peliculas_usuario_historial ADD INDEX FKpeliculas_90986 (peliculasid_pelicula), ADD CONSTRAINT FKpeliculas_90986 FOREIGN KEY (peliculasid_pelicula) REFERENCES peliculas (id_pelicula);
ALTER TABLE peliculas_usuario_historial ADD INDEX FKpeliculas_453502 (usuarioid_usuario), ADD CONSTRAINT FKpeliculas_453502 FOREIGN KEY (usuarioid_usuario) REFERENCES usuario (id_usuario);

-- select * from categorias_peliculas;

insert into categorias(nombre_categoria) values("Inicio");
insert into categorias(nombre_categoria) values("Acción");
insert into categorias(nombre_categoria) values("Ciencia Ficción");
insert into categorias(nombre_categoria) values("Comedia");
insert into categorias(nombre_categoria) values("Películas actuales");
insert into categorias(nombre_categoria) values("Fantasía");
insert into categorias(nombre_categoria) values("Musical");
insert into categorias(nombre_categoria) values("Películas antiguas");
insert into categorias(nombre_categoria) values("Informática");
insert into categorias(nombre_categoria) values("Estrenos");
insert into categorias(nombre_categoria) values("Clásicos");
insert into categorias(nombre_categoria) values("Mudas");
insert into categorias(nombre_categoria) values("Películas en blanco y negro");
insert into categorias(nombre_categoria) values("Ropa y accesorios");
insert into categorias(nombre_categoria) values("aventuras");
insert into categorias(nombre_categoria) values("Dramáticas");
insert into categorias(nombre_categoria) values("terror");
insert into categorias(nombre_categoria) values("Infantiles");


-- select * from peliculas_usuario_historial;