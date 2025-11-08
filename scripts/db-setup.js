import fs from 'fs/promises';
import { pool } from '../src/db/pool.js';

const run = async () => {
  try {
    const schema = await fs.readFile(new URL('./schema.sql', import.meta.url), 'utf-8');
    await pool.query(schema);
    console.log('Schema migrated.');
    const seed = await fs.readFile(new URL('./seed.sql', import.meta.url), 'utf-8');
    await pool.query(seed);
    console.log('Seed inserted.');
  } catch (e) {
    console.error('Error in db setup:', e);
  } finally {
    await pool.end();
  }
};

run();
