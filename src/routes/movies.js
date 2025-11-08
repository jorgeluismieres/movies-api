
import { Router } from 'express';
import { pool } from '../db/pool.js';
import { MovieSchema } from '../validators/movie.js';
import { handleZod } from '../controllers/helpers.js';

const router = Router();

// helper to load one movie with relations
async function loadMovie(id){
  const { rows: mRows } = await pool.query('SELECT * FROM movies WHERE id=$1',[id]);
  if(!mRows[0]) return null;
  const movie = mRows[0];
  const { rows: g } = await pool.query(`
    SELECT g.* FROM genres g 
    JOIN movie_genres mg ON mg.genre_id=g.id WHERE mg.movie_id=$1`,[id]);
  const { rows: a } = await pool.query(`
    SELECT a.* FROM actors a 
    JOIN movie_actors ma ON ma.actor_id=a.id WHERE ma.movie_id=$1`,[id]);
  const { rows: d } = await pool.query(`
    SELECT d.* FROM directors d 
    JOIN movie_directors md ON md.director_id=d.id WHERE md.movie_id=$1`,[id]);
  return { ...movie, genres: g, actors: a, directors: d };
}

router.get('/', async (req,res,next)=>{
  try {
    const { rows } = await pool.query('SELECT id FROM movies ORDER BY id');
    const full = await Promise.all(rows.map(r => loadMovie(r.id)));
    res.json(full);
  } catch(e){ next(e); }
});

router.post('/', async (req,res,next)=>{
  try {
    const data = handleZod(MovieSchema, req.body);
    const { rows } = await pool.query(
      'INSERT INTO movies(name,image,synopsis,release_year) VALUES($1,$2,$3,$4) RETURNING id',
      [data.name, data.image || null, data.synopsis, data.release_year]
    );
    const movie = await loadMovie(rows[0].id);
    res.status(201).json(movie);
  } catch(e){ next(e); }
});

router.get('/:id', async (req,res,next)=>{
  try {
    const movie = await loadMovie(req.params.id);
    if(!movie) return res.status(404).json({message:'No encontrado'});
    res.json(movie);
  } catch(e){ next(e); }
});

router.put('/:id', async (req,res,next)=>{
  try {
    const data = handleZod(MovieSchema, req.body);
    await pool.query(
      'UPDATE movies SET name=$1,image=$2,synopsis=$3,release_year=$4 WHERE id=$5',
      [data.name, data.image || null, data.synopsis, data.release_year, req.params.id]
    );
    const movie = await loadMovie(req.params.id);
    res.json(movie);
  } catch(e){ next(e); }
});

router.delete('/:id', async (req,res,next)=>{
  try {
    await pool.query('DELETE FROM movie_genres WHERE movie_id=$1',[req.params.id]);
    await pool.query('DELETE FROM movie_actors WHERE movie_id=$1',[req.params.id]);
    await pool.query('DELETE FROM movie_directors WHERE movie_id=$1',[req.params.id]);
    await pool.query('DELETE FROM movies WHERE id=$1',[req.params.id]);
    res.status(204).end();
  } catch(e){ next(e); }
});

// --- Extra endpoints to set relations ---
async function attachAndReturn(table, col, idCol, movieId, ids){
  // insert ignoring duplicates
  const values = ids.map((gid,i)=>`($1,$${i+2})`).join(',');
  const params = [movieId, ...ids];
  await pool.query(`INSERT INTO ${table}(${col},${idCol}) VALUES ${values} ON CONFLICT DO NOTHING`, params);
  // return collection
  const map = { movie_genres:'genres', movie_actors:'actors', movie_directors:'directors' };
  if(table==='movie_genres'){
    const { rows } = await pool.query('SELECT g.* FROM genres g JOIN movie_genres mg ON mg.genre_id=g.id WHERE mg.movie_id=$1',[movieId]);
    return rows;
  }
  if(table==='movie_actors'){
    const { rows } = await pool.query('SELECT a.* FROM actors a JOIN movie_actors ma ON ma.actor_id=a.id WHERE ma.movie_id=$1',[movieId]);
    return rows;
  }
  if(table==='movie_directors'){
    const { rows } = await pool.query('SELECT d.* FROM directors d JOIN movie_directors md ON md.director_id=d.id WHERE md.movie_id=$1',[movieId]);
    return rows;
  }
}

router.post('/:id/genres', async (req,res,next)=>{
  try {
    const ids = Array.isArray(req.body) ? req.body.map(Number).filter(Boolean) : [];
    if(!ids.length) throw new Error('Body debe ser un array de IDs');
    const out = await attachAndReturn('movie_genres','movie_id','genre_id', req.params.id, ids);
    res.json(out);
  } catch(e){ next(e); }
});

router.post('/:id/actors', async (req,res,next)=>{
  try {
    const ids = Array.isArray(req.body) ? req.body.map(Number).filter(Boolean) : [];
    if(!ids.length) throw new Error('Body debe ser un array de IDs');
    const out = await attachAndReturn('movie_actors','movie_id','actor_id', req.params.id, ids);
    res.json(out);
  } catch(e){ next(e); }
});

router.post('/:id/directors', async (req,res,next)=>{
  try {
    const ids = Array.isArray(req.body) ? req.body.map(Number).filter(Boolean) : [];
    if(!ids.length) throw new Error('Body debe ser un array de IDs');
    const out = await attachAndReturn('movie_directors','movie_id','director_id', req.params.id, ids);
    res.json(out);
  } catch(e){ next(e); }
});

export default router;
