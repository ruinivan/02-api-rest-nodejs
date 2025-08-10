import fastify from 'fastify';

const app = fastify();

// GET, POST, PUT, PATCH, DELETE

// http://localhost:3333/hello

app.get('/hello', async () => {
  return 'Hello World!';
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
