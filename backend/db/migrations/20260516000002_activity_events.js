/**
 * activity_events — generic UI/behavioral event log.
 * Captures every meaningful action from the HTML/RN client:
 *   login, screen_view, cart_add, cart_remove, order_placed,
 *   plant_added, plant_watered, post_created, etc.
 *
 * Designed to be cheap to insert and queryable for funnels.
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('activity_events', (t) => {
    t.bigIncrements('id').primary();
    t.uuid('user_id')
      .references('id').inTable('users').onDelete('CASCADE');
    t.string('event_type', 60).notNullable();   // e.g. cart_add, screen_view
    t.string('screen', 60).defaultTo('');       // home|shop|garden|cart|profile|...
    t.jsonb('payload').notNullable().defaultTo('{}');
    t.string('client', 20).defaultTo('web');    // web|android|ios
    t.string('ip', 45).defaultTo('');
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index(['user_id', 'created_at']);
    t.index(['event_type']);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('activity_events');
};
