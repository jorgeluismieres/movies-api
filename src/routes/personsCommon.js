
import { Router } from 'express';
import { pool } from '../db/pool.js';
import { PersonSchema } from '../validators/person.js';
import { handleZod } from '../controllers/helpers.js';

export const buildPersonRouter = (table) => {
  const router = Router();

  router.get('/', async (req,res,next)=>{
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY id`);
      res.json(rows);
    } catch(e){ next(e); }
  });

  router.post('/', async (req,res,next)=>{
    try {
      const data = handleZod(PersonSchema, req.body);
      const { rows } = await pool.query(
        `INSERT INTO ${table}(first_name,last_name,nationality,image,birthday) VALUES($1,$2,$3,$4,$5) RETURNING *`,
        [data.first_name,data.last_name,data.nationality,data.image || null,data.birthday]
      );
      res.status(201).json(rows[0]);
    } catch(e){ next(e); }
  });

  router.get('/:id', async (req,res,next)=>{
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id=$1`,[req.params.id]);
      if(!rows[0]) return res.status(404).json({message:'No encontrado'});
      res.json(rows[0]);
    } catch(e){ next(e); }
  });

  router.put('/:id', async (req,res,next)=>{
    try {
      const data = handleZod(PersonSchema, req.body);
      const { rows } = await pool.query(
        `UPDATE ${table} SET first_name=$1,last_name=$2,nationality=$3,image=$4,birthday=$5 WHERE id=$6 RETURNING *`,
        [data.first_name,data.last_name,data.nationality,data.image || null,data.birthday, req.params.id]
      );
      res.json(rows[0]);
    } catch(e){ next(e); }
  });

  router.delete('/:id', async (req,res,next)=>{
    try {
      if (table==='actors') {
        await pool.query('DELETE FROM movie_actors WHERE actor_id=$1',[req.params.id]);
      } else if (table==='directors') {
        await pool.query('DELETE FROM movie_directors WHERE director_id=$1',[req.params.id]);
      }
      await pool.query(`DELETE FROM ${table} WHERE id=$1`,[req.params.id]);
      res.status(204).end();
    } catch(e){ next(e); }
  });

  return router;
};
