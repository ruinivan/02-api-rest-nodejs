import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { env } from './env/index';
import { transactionsRoutes } from './routes/transactions-routes';

const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: 'transactions',
});

app
  .listen({ port: env.PORT })
  .then(() => {
    console.log('HTTP Server running on http://localhost:3333');
  })
  .catch((err) => {
    console.error('Error starting server:', err);
  });

// EcmaScript Lint
