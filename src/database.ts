import knex from 'knex';

export const setupKnex = knex({
  client: 'sqlite',
  connection: {
    filename: './tmp/app.db',
  },
  useNullAsDefault: true,
});
