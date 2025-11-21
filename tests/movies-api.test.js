import request from 'supertest';
import '../src/server.js';

jest.setTimeout(30000); 

const baseUrl = `http://localhost:${process.env.PORT || 4000}`;

describe('Movies API (19 tests)', () => {
  let genreId;
  let actorId;
  let actorUpdatePayload;
  let directorId;
  let movieId;

  // ---------- GENRES ----------

  test('01 - GET /genres debería responder 200 y un array', async () => {
    const res = await request(baseUrl).get('/genres');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('02 - POST /genres debería crear un género', async () => {
    const payload = { name: 'Suspenso Test' };
    const res = await request(baseUrl).post('/genres').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(payload.name);
    genreId = res.body.id;
  });

  test('03 - GET /genres/:id debería devolver el género creado', async () => {
    const res = await request(baseUrl).get(`/genres/${genreId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', genreId);
    expect(res.body).toHaveProperty('name');
  });

  test('04 - PUT /genres/:id debería actualizar el nombre', async () => {
    const payload = { name: 'Suspenso Actualizado' };
    const res = await request(baseUrl).put(`/genres/${genreId}`).send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', genreId);
    expect(res.body.name).toBe(payload.name);
  });

  test('05 - DELETE /genres/:id debería responder 204', async () => {
    const res = await request(baseUrl).delete(`/genres/${genreId}`);
    expect(res.statusCode).toBe(204);
  });

  // ---------- ACTORS ----------

  test('06 - GET /actors debería responder 200 y un array', async () => {
    const res = await request(baseUrl).get('/actors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('07 - POST /actors debería crear un actor', async () => {
    const payload = {
      first_name: 'Test',
      last_name: 'Actor',
      nationality: 'Testland',
      image: '',
      birthday: '1990-01-01',
    };
    const res = await request(baseUrl).post('/actors').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.first_name).toBe(payload.first_name);
    expect(res.body.last_name).toBe(payload.last_name);
    actorId = res.body.id;
    actorUpdatePayload = payload;
  });

  test('08 - GET /actors/:id debería devolver el actor creado', async () => {
    const res = await request(baseUrl).get(`/actors/${actorId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', actorId);
    expect(res.body).toHaveProperty('first_name');
    expect(res.body).toHaveProperty('last_name');
  });

  test('09 - PUT /actors/:id debería actualizar nationality', async () => {
    const updated = { ...actorUpdatePayload, nationality: 'UpdatedLand' };
    const res = await request(baseUrl).put(`/actors/${actorId}`).send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', actorId);
    expect(res.body.nationality).toBe('UpdatedLand');
  });

  test('10 - DELETE /actors/:id debería responder 204', async () => {
    const res = await request(baseUrl).delete(`/actors/${actorId}`);
    expect(res.statusCode).toBe(204);
  });

  // ---------- DIRECTORS ----------

  test('11 - GET /directors debería responder 200 y un array', async () => {
    const res = await request(baseUrl).get('/directors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('12 - POST /directors debería crear un director', async () => {
    const payload = {
      first_name: 'Test',
      last_name: 'Director',
      nationality: 'DirLand',
      image: '',
      birthday: '1980-05-05',
    };
    const res = await request(baseUrl).post('/directors').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    directorId = res.body.id;
  });

  test('13 - GET /directors/:id debería devolver el director creado', async () => {
    const res = await request(baseUrl).get(`/directors/${directorId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', directorId);
  });

  // ---------- MOVIES ----------

  test('14 - GET /movies debería responder 200 y traer relaciones', async () => {
    const res = await request(baseUrl).get('/movies');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const movie = res.body[0];
      expect(movie).toHaveProperty('genres');
      expect(movie).toHaveProperty('actors');
      expect(movie).toHaveProperty('directors');
    }
  });

  test('15 - POST /movies debería crear una película', async () => {
    const payload = {
      name: 'Test Movie',
      image: '',
      synopsis: 'Una película de prueba',
      release_year: 2020,
    };
    const res = await request(baseUrl).post('/movies').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(payload.name);
    movieId = res.body.id;
  });

  test('16 - GET /movies/:id debería devolver la película con relaciones', async () => {
    const res = await request(baseUrl).get(`/movies/${movieId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', movieId);
    expect(res.body).toHaveProperty('genres');
    expect(res.body).toHaveProperty('actors');
    expect(res.body).toHaveProperty('directors');
  });

  test('17 - PUT /movies/:id debería actualizar la película', async () => {
    const payload = {
      name: 'Test Movie Actualizada',
      image: '',
      synopsis: 'Sinopsis actualizada',
      release_year: 2021,
    };
    const res = await request(baseUrl).put(`/movies/${movieId}`).send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', movieId);
    expect(res.body.name).toBe(payload.name);
    expect(res.body.release_year).toBe(payload.release_year);
  });

  test('18 - DELETE /movies/:id debería responder 204', async () => {
    const res = await request(baseUrl).delete(`/movies/${movieId}`);
    expect(res.statusCode).toBe(204);
  });

  // ---------- RELACIONES EXTRA ----------

  test('19 - Endpoints de relaciones /movies/:id/genres|actors|directors funcionan', async () => {
    const genreRes = await request(baseUrl).post('/genres').send({ name: 'Acción Test' });
    const actorRes = await request(baseUrl).post('/actors').send({
      first_name: 'Rel',
      last_name: 'Actor',
      nationality: 'RelLand',
      image: '',
      birthday: '1991-02-02',
    });
    const directorRes = await request(baseUrl).post('/directors').send({
      first_name: 'Rel',
      last_name: 'Director',
      nationality: 'RelLand',
      image: '',
      birthday: '1975-03-03',
    });
    const movieRes = await request(baseUrl).post('/movies').send({
      name: 'Relaciones Movie',
      image: '',
      synopsis: 'Película para probar relaciones',
      release_year: 2015,
    });

    const mId = movieRes.body.id;
    const gId = genreRes.body.id;
    const aId = actorRes.body.id;
    const dId = directorRes.body.id;

    const addGenres = await request(baseUrl)
      .post(`/movies/${mId}/genres`)
      .send([gId]);
    expect(addGenres.statusCode).toBe(200);
    expect(Array.isArray(addGenres.body)).toBe(true);
    expect(addGenres.body.length).toBeGreaterThan(0);

    const addActors = await request(baseUrl)
      .post(`/movies/${mId}/actors`)
      .send([aId]);
    expect(addActors.statusCode).toBe(200);
    expect(Array.isArray(addActors.body)).toBe(true);
    expect(addActors.body.length).toBeGreaterThan(0);

    const addDirectors = await request(baseUrl)
      .post(`/movies/${mId}/directors`)
      .send([dId]);
    expect(addDirectors.statusCode).toBe(200);
    expect(Array.isArray(addDirectors.body)).toBe(true);
    expect(addDirectors.body.length).toBeGreaterThan(0);
  });
});