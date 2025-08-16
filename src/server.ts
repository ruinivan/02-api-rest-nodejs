import fastify from 'fastify';
import { setupKnex } from './database';

const app = fastify();

// GET, POST, PUT, PATCH, DELETE

// http://localhost:3333/hello

app.get('/hello', async () => {
  const tables = await setupKnex('sqlite_schema').select('*');

  return tables;
});

app
  .listen({ port: 3333 })
  .then(() => {
    console.log('HTTP Server running on http://localhost:3333');
  })
  .catch((err) => {
    console.error('Error starting server:', err);
  });

// EcmaScript Lint
