
INSERT INTO genres(name) VALUES 
('Acción'),('Aventura'),('Drama'),('Comedia'),('Ciencia Ficción')
ON CONFLICT DO NOTHING;

INSERT INTO actors(first_name,last_name,nationality,image,birthday) VALUES
('Keanu','Reeves','Canadá',NULL,'1964-09-02'),
('Carrie-Anne','Moss','Canadá',NULL,'1967-08-21'),
('Scarlett','Johansson','EEUU',NULL,'1984-11-22')
ON CONFLICT DO NOTHING;

INSERT INTO directors(first_name,last_name,nationality,image,birthday) VALUES
('Lana','Wachowski','EEUU',NULL,'1965-06-21'),
('Lilly','Wachowski','EEUU',NULL,'1967-12-29'),
('Christopher','Nolan','Reino Unido',NULL,'1970-07-30')
ON CONFLICT DO NOTHING;

-- Crea dos películas de ejemplo
INSERT INTO movies(name,image,synopsis,release_year) VALUES
('The Matrix',NULL,'Un hacker descubre la verdad sobre su realidad.',1999),
('Inception',NULL,'Un equipo entra en los sueños para implantar ideas.',2010)
ON CONFLICT DO NOTHING;

-- Relaciones
-- Matrix -> Acción, Ciencia Ficción; actores: Keanu, Carrie-Anne; directores: Lana, Lilly
INSERT INTO movie_genres(movie_id,genre_id)
SELECT m.id, g.id FROM movies m, genres g 
WHERE m.name='The Matrix' AND g.name IN ('Acción','Ciencia Ficción')
ON CONFLICT DO NOTHING;

INSERT INTO movie_actors(movie_id,actor_id)
SELECT m.id, a.id FROM movies m, actors a 
WHERE m.name='The Matrix' AND a.first_name||' '||a.last_name IN ('Keanu Reeves','Carrie-Anne Moss')
ON CONFLICT DO NOTHING;

INSERT INTO movie_directors(movie_id,director_id)
SELECT m.id, d.id FROM movies m, directors d 
WHERE m.name='The Matrix' AND d.first_name||' '||d.last_name IN ('Lana Wachowski','Lilly Wachowski')
ON CONFLICT DO NOTHING;

-- Inception -> Acción, Aventura; director: Nolan; actor: Scarlett (ficticio para demo)
INSERT INTO movie_genres(movie_id,genre_id)
SELECT m.id, g.id FROM movies m, genres g 
WHERE m.name='Inception' AND g.name IN ('Acción','Aventura')
ON CONFLICT DO NOTHING;

INSERT INTO movie_directors(movie_id,director_id)
SELECT m.id, d.id FROM movies m, directors d 
WHERE m.name='Inception' AND d.first_name||' '||d.last_name = 'Christopher Nolan'
ON CONFLICT DO NOTHING;
