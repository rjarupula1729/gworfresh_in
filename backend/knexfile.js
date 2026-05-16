// Knex config for Postgres
// All env vars are read from backend/.env
require('dotenv').config();

const base = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: process.env.PGHOST || '127.0.0.1',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'growfresh',
  },
  pool: { min: 2, max: 10 },
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

module.exports = {
  development: base,
  production: {
    ...base,
    connection: {
      ...(typeof base.connection === 'string'
        ? { connectionString: base.connection }
        : base.connection),
      ssl: { rejectUnauthorized: false },
    },
  },
};
