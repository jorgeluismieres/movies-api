
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'dotenv/config.js';
import { pool } from './db/pool.js';
import genresRouter from './routes/genres.js';
import actorsRouter from './routes/actors.js';
import directorsRouter from './routes/directors.js';
import moviesRouter from './routes/movies.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// simple health
app.get('/', (req,res)=>res.json({ok:true,ts:new Date().toISOString()}));

app.use('/genres', genresRouter);
app.use('/actors', actorsRouter);
app.use('/directors', directorsRouter);
app.use('/movies', moviesRouter);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === '23505') { // unique_violation
    return res.status(409).json({ message: 'Registro duplicado', detail: err.detail });
  }
  res.status(400).json({ message: err.message || 'Error inesperado' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  try {
    await pool.query('select 1');
    console.log(`Movies API escuchando en :${PORT}`);
  } catch (e) {
    console.error('Error conectando a la DB', e.message);
  }
});

export default app;
