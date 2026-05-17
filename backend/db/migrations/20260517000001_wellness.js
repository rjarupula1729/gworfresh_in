/**
 * Wellness ecosystem persistence.
 *
 * Tables:
 *   wellness_log           – per-user per-day check-ins (breaks[5], breathing, hour_for_you)
 *   community_memberships  – join/leave state for the 12 Communities Hub topics
 *
 * GrowPoints reuse the existing users.reward_points column from the init
 * migration — no new column needed.
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('wellness_log', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.date('day').notNullable();                          // YYYY-MM-DD
    t.jsonb('breaks').notNullable().defaultTo('[false,false,false,false,false]');
    t.boolean('breathing').notNullable().defaultTo(false);
    t.boolean('hour_for_you').notNullable().defaultTo(false);
    t.integer('points_awarded').notNullable().defaultTo(0); // cumulative points for this day
    t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    t.unique(['user_id', 'day']);
    t.index(['user_id', 'day']);
  });

  await knex.schema.createTable('community_memberships', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.string('community_id', 80).notNullable();  // string slug from RN client (e.g. 'urban-gardeners')
    t.timestamp('joined_at').notNullable().defaultTo(knex.fn.now());
    t.unique(['user_id', 'community_id']);
    t.index(['user_id']);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('community_memberships');
  await knex.schema.dropTableIfExists('wellness_log');
};
