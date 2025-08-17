import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { knexConnection } from '../database';
import z from 'zod';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

// Cookies <-> Formas de manter contexto entre requisições

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const transactions = await knexConnection('transactions')
        .where('session_id', sessionId)
        .select('*')
        .orderBy('created_at', 'desc');

      return { transactions };
    }
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(request.params);

      const transaction = await knexConnection('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first();

      if (!transaction) {
        return reply.status(404).send('Transaction not found');
      }

      return { transaction };
    }
  );

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await knexConnection('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first();

      return { summary };
    }
  );

  app.post('/', async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { title, amount, type } = createTransactionSchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knexConnection('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : -amount,
      session_id: sessionId,
    });

    return reply.status(201).send('Transaction created successfully');
  });

  app.delete('/:id', async (request) => {
    const { sessionId } = request.cookies;

    const deleteTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = deleteTransactionParamsSchema.parse(request.params);

    const transaction = await knexConnection('transactions')
      .where({
        id,
        session_id: sessionId,
      })
      .first();

    if (!transaction) {
      return { statusCode: 404, message: 'Transaction not found' };
    }

    await knexConnection('transactions').where('id', id).delete();

    return { statusCode: 200, message: 'Transaction deleted successfully' };
  });
};
