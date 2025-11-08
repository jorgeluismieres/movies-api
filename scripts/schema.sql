
-- Esquema base
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS actors (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  image TEXT,
  birthday DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS directors (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  image TEXT,
  birthday DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  synopsis TEXT NOT NULL,
  release_year INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE IF NOT EXISTS movie_actors (
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  actor_id INTEGER REFERENCES actors(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, actor_id)
);

CREATE TABLE IF NOT EXISTS movie_directors (
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  director_id INTEGER REFERENCES directors(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, director_id)
);
