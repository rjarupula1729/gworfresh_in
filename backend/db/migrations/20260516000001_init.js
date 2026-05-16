/**
 * Initial schema for GrowFresh on Postgres.
 *
 * Tables:
 *   users                  – identity (mobile-OTP) + profile fields
 *   family_members         – per-user dependents (mom, dad, kids…)
 *   user_health_profile    – 1-1 with users (age, gender, conditions, goals)
 *   product_categories     – Seeds · Saplings · Minerals · Compost · …
 *   products               – catalog (price, stock, image, instructions)
 *   user_addresses         – saved delivery addresses
 *   orders                 – purchase header
 *   order_items            – line items (snapshot of price/name at sale time)
 *   transactions           – payment events (1-many with orders – retries etc.)
 *   user_plants            – plants the user is growing in their garden
 *   community_posts        – social posts
 *   community_comments     – comments on posts
 *
 * Analytical indexes are included up-front for the common queries
 * (user purchase history, top products per category, etc.).
 */
exports.up = async function up(knex) {
  // ─── extensions ─────────────────────────────────────────
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"'); // gen_random_uuid()

  // ─── users ─────────────────────────────────────────────
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('mobile', 15).notNullable().unique();
    t.string('name', 120).defaultTo('');
    t.string('email', 180).defaultTo('');
    t.string('city', 80).defaultTo('');
    t.string('avatar', 500).defaultTo('');
    t.integer('reward_points').notNullable().defaultTo(0);
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // ─── family ────────────────────────────────────────────
  await knex.schema.createTable('family_members', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.string('name', 120).notNullable();
    t.string('relation', 50).notNullable();
    t.string('age', 10).defaultTo('');
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index(['user_id']);
  });

  // ─── health profile (1-1 with user) ────────────────────
  await knex.schema.createTable('user_health_profile', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable().unique()
      .references('id').inTable('users').onDelete('CASCADE');
    t.integer('age');
    t.string('gender', 20);
    t.integer('height_cm');
    t.decimal('weight_kg', 5, 2);
    t.integer('water_glasses_per_day');
    t.integer('sleep_hours_per_day');
    t.specificType('conditions', 'text[]').defaultTo('{}'); // diabetes, hypertension…
    t.specificType('goals', 'text[]').defaultTo('{}');       // weight-loss, immunity…
    t.string('insurance_provider', 120);
    t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // ─── product categories ────────────────────────────────
  await knex.schema.createTable('product_categories', (t) => {
    t.increments('id').primary();
    t.string('slug', 50).notNullable().unique();
    t.string('name', 80).notNullable();
    t.string('icon', 10).defaultTo('📦');
    t.integer('sort_order').notNullable().defaultTo(100);
  });

  // ─── products ──────────────────────────────────────────
  await knex.schema.createTable('products', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.integer('category_id').notNullable()
      .references('id').inTable('product_categories').onDelete('RESTRICT');
    t.string('name', 160).notNullable();
    t.text('description').defaultTo('');
    t.text('instructions').defaultTo('');
    t.decimal('price', 10, 2).notNullable();
    t.integer('stock').notNullable().defaultTo(0);
    t.string('image_url', 500).defaultTo('');
    t.string('region', 80).defaultTo('');     // for geolocation suggestions
    t.specificType('tags', 'text[]').defaultTo('{}');
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index(['category_id']);
    t.index(['region']);
  });

  // ─── user addresses ────────────────────────────────────
  await knex.schema.createTable('user_addresses', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.string('label', 40).defaultTo('Home');
    t.string('line1', 200).notNullable();
    t.string('line2', 200).defaultTo('');
    t.string('city', 80).notNullable();
    t.string('state', 80).notNullable();
    t.string('pincode', 12).notNullable();
    t.string('country', 60).notNullable().defaultTo('India');
    t.boolean('is_default').notNullable().defaultTo(false);
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index(['user_id']);
  });

  // ─── orders ────────────────────────────────────────────
  await knex.schema.createTable('orders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('RESTRICT');
    t.decimal('subtotal', 10, 2).notNullable().defaultTo(0);
    t.decimal('delivery_charge', 10, 2).notNullable().defaultTo(0);
    t.decimal('total', 10, 2).notNullable().defaultTo(0);
    t.string('status', 30).notNullable().defaultTo('Pending');         // Pending|Confirmed|Shipped|Delivered|Cancelled
    t.string('payment_method', 20).notNullable().defaultTo('COD');     // COD|Online
    t.string('payment_status', 20).notNullable().defaultTo('Pending'); // Pending|Paid|Failed|Refunded
    t.jsonb('address').notNullable().defaultTo('{}');                  // snapshot at sale time
    t.timestamp('placed_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('confirmed_at');
    t.timestamp('shipped_at');
    t.timestamp('delivered_at');
    t.index(['user_id']);
    t.index(['status']);
    t.index(['placed_at']);
  });

  // ─── order items ───────────────────────────────────────
  await knex.schema.createTable('order_items', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('order_id').notNullable()
      .references('id').inTable('orders').onDelete('CASCADE');
    t.uuid('product_id').notNullable()
      .references('id').inTable('products').onDelete('RESTRICT');
    t.integer('category_id'); // denormalized for fast analytics
    t.string('name_snapshot', 160).notNullable();
    t.decimal('price_snapshot', 10, 2).notNullable();
    t.integer('quantity').notNullable();
    t.decimal('line_total', 10, 2).notNullable();
    t.index(['order_id']);
    t.index(['product_id']);
    t.index(['category_id']);
  });

  // ─── transactions (payment events) ─────────────────────
  await knex.schema.createTable('transactions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('RESTRICT');
    t.uuid('order_id')
      .references('id').inTable('orders').onDelete('SET NULL');
    t.decimal('amount', 10, 2).notNullable();
    t.string('currency', 6).notNullable().defaultTo('INR');
    t.string('payment_method', 20).notNullable();   // UPI|Card|Wallet|COD|NetBanking
    t.string('status', 20).notNullable();           // success|failed|pending|refunded
    t.string('gateway', 30).defaultTo('demo');      // razorpay|stripe|demo
    t.string('gateway_ref', 120).defaultTo('');
    t.jsonb('meta').defaultTo('{}');
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index(['user_id']);
    t.index(['order_id']);
    t.index(['status']);
  });

  // ─── user plants (garden) ──────────────────────────────
  await knex.schema.createTable('user_plants', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.uuid('product_id')
      .references('id').inTable('products').onDelete('SET NULL');
    t.string('plant_type', 80).notNullable();
    t.integer('days_planted').notNullable().defaultTo(1);
    t.integer('total_days').notNullable().defaultTo(60);
    t.string('status', 20).notNullable().defaultTo('growing'); // growing|harvested|dead
    t.timestamp('planted_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('last_watered_at');
    t.index(['user_id']);
  });

  // ─── community ─────────────────────────────────────────
  await knex.schema.createTable('community_posts', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.text('content').notNullable();
    t.string('image_url', 500).defaultTo('');
    t.integer('likes_count').notNullable().defaultTo(0);
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index(['user_id']);
    t.index(['created_at']);
  });

  await knex.schema.createTable('community_comments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('post_id').notNullable()
      .references('id').inTable('community_posts').onDelete('CASCADE');
    t.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.text('content').notNullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index(['post_id']);
  });

  // ─── analytics view: user purchase rollup ──────────────
  await knex.raw(`
    CREATE OR REPLACE VIEW v_user_purchase_rollup AS
    SELECT
      u.id                                AS user_id,
      u.name,
      u.city,
      COUNT(DISTINCT o.id)                AS total_orders,
      COALESCE(SUM(o.total), 0)           AS lifetime_spend,
      MAX(o.placed_at)                    AS last_order_at,
      COALESCE(SUM(oi.quantity), 0)       AS total_items_bought
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.status <> 'Cancelled'
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY u.id, u.name, u.city;
  `);

  // ─── analytics view: top categories per user ───────────
  await knex.raw(`
    CREATE OR REPLACE VIEW v_user_top_categories AS
    SELECT
      o.user_id,
      pc.id           AS category_id,
      pc.name         AS category_name,
      SUM(oi.quantity) AS units_bought,
      SUM(oi.line_total) AS spent
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id AND o.status <> 'Cancelled'
    JOIN product_categories pc ON pc.id = oi.category_id
    GROUP BY o.user_id, pc.id, pc.name;
  `);
};

exports.down = async function down(knex) {
  await knex.raw('DROP VIEW IF EXISTS v_user_top_categories');
  await knex.raw('DROP VIEW IF EXISTS v_user_purchase_rollup');
  for (const tbl of [
    'community_comments',
    'community_posts',
    'user_plants',
    'transactions',
    'order_items',
    'orders',
    'user_addresses',
    'products',
    'product_categories',
    'user_health_profile',
    'family_members',
    'users',
  ]) {
    await knex.schema.dropTableIfExists(tbl);
  }
};
