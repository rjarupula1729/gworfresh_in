// Shared Knex (Postgres) instance.
//   const db = require('../config/db');
//   const user = await db('users').where({ id }).first();
const knexFactory = require('knex');
const knexConfig = require('../knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knexFactory(knexConfig[env]);

db.raw('SELECT 1')
  .then(() => console.log(`✅ Postgres connected (${env})`))
  .catch((err) => console.error('❌ Postgres connection error:', err.message));

module.exports = db;
