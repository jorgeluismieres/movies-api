
import { Router } from 'express';
import { pool } from '../db/pool.js';
import { GenreSchema } from '../validators/genre.js';
import { handleZod } from '../controllers/helpers.js';

const router = Router();

router.get('/', async (req,res,next)=>{
  try {
    const { rows } = await pool.query('SELECT * FROM genres ORDER BY id');
    res.json(rows);
  } catch(e){ next(e); }
});

router.post('/', async (req,res,next)=>{
  try {
    const data = handleZod(GenreSchema, req.body);
    const { rows } = await pool.query('INSERT INTO genres(name) VALUES($1) RETURNING *',[data.name]);
    res.status(201).json(rows[0]);
  } catch(e){ next(e); }
});

router.get('/:id', async (req,res,next)=>{
  try {
    const { rows } = await pool.query('SELECT * FROM genres WHERE id=$1',[req.params.id]);
    if(!rows[0]) return res.status(404).json({message:'No encontrado'});
    res.json(rows[0]);
  } catch(e){ next(e); }
});

router.put('/:id', async (req,res,next)=>{
  try {
    const data = handleZod(GenreSchema, req.body);
    const { rows } = await pool.query('UPDATE genres SET name=$1 WHERE id=$2 RETURNING *',[data.name, req.params.id]);
    res.json(rows[0]);
  } catch(e){ next(e); }
});

router.delete('/:id', async (req,res,next)=>{
  try {
    await pool.query('DELETE FROM movie_genres WHERE genre_id=$1',[req.params.id]);
    await pool.query('DELETE FROM genres WHERE id=$1',[req.params.id]);
    res.status(204).end();
  } catch(e){ next(e); }
});

export default router;
