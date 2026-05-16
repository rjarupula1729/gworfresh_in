# GrowFresh Backend — Postgres Edition

> Migrated from MongoDB/Mongoose → **PostgreSQL + Knex** (May 2026).
> All user data, profile, family, products, orders and transactions now live
> in a normalised relational schema so we can run behavioural analytics.

---

## 1. Quick start

```bash
# 1. Install Postgres (macOS)
brew install postgresql@16
brew services start postgresql@16
createdb growfresh

# 2. Install backend deps
cd backend
npm install

# 3. Configure env
cp .env.example .env
#   edit .env if your Postgres user/password differs

# 4. Build schema + load demo catalog
npm run db:migrate
npm run db:seed

# 5. Run the API
npm run dev      # nodemon
# or
npm start
```

The API will listen on `http://localhost:5000` (matches the React Native
client at `src/services/api.js`).

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run db:migrate`  | Run all pending migrations                  |
| `npm run db:rollback` | Roll back the last migration batch          |
| `npm run db:seed`     | Re-seed categories + 20 demo products       |
| `npm run db:reset`    | Drop everything → migrate → seed (DEV ONLY) |

---

## 2. Folder layout

```
backend/
├── server.js              # Express bootstrap
├── knexfile.js            # Knex client config (dev / prod)
├── package.json
├── .env.example           # template – copy to .env
│
├── config/
│   └── db.js              # shared Knex instance (require this everywhere)
│
├── middleware/
│   └── auth.js            # JWT verification middleware
│
├── db/
│   ├── migrations/        # schema versions (Knex managed)
│   │   └── 20260516000001_init.js
│   └── seeds/             # demo data
│       └── 01_products.js
│
└── routes/
    ├── auth.js            # OTP login + profile + family + health
    ├── products.js        # catalog
    ├── orders.js          # checkout (TX-wrapped)
    ├── cart.js            # in-memory cart (no DB)
    ├── garden.js          # user's plants
    ├── community.js       # social posts + comments
    ├── instructors.js     # ⚠ stub – schema not in v1
    └── analytics.js       # behaviour insights + recommendations
```

---

## 3. Naming conventions (please follow!)

| Item             | Convention            | Example                         |
| ---------------- | --------------------- | ------------------------------- |
| Folders          | lowercase plural      | `routes/`, `models/`            |
| JS files         | lowercase, no spaces  | `auth.js`, `analytics.js`       |
| Route paths      | lowercase plural noun | `/api/orders`, `/api/products`  |
| Migration files  | `YYYYMMDDHHMMSS_desc` | `20260516000001_init.js`        |
| Seed files       | `NN_topic.js`         | `01_products.js`                |
| DB tables        | snake_case plural     | `users`, `order_items`          |
| DB columns       | snake_case            | `user_id`, `reward_points`      |
| SQL views        | `v_<topic>` prefix    | `v_user_purchase_rollup`        |
| JS variables     | camelCase             | `rewardPoints`, `userId`        |
| JS env vars      | UPPER_SNAKE_CASE      | `DATABASE_URL`, `JWT_SECRET`    |
| API JSON keys    | camelCase             | `totalAmount`, `paymentMethod`  |

**Snake_case ↔ camelCase bridging:** the DB stores `reward_points` /
`total` / `payment_method`. Each route handler maps these to camelCase
(`rewardPoints`, `totalAmount`, `paymentMethod`) before sending JSON to
the React Native client — keep doing this in any new endpoints.

---

## 4. Schema (12 tables + 2 views)

```
users ───┬──< family_members
         ├──1 user_health_profile
         ├──< user_addresses
         ├──< orders ──< order_items >── products >── product_categories
         │       └──< transactions
         ├──< user_plants >── products
         ├──< community_posts ──< community_comments
         └──< transactions
```

Analytical views:

| View                        | Purpose                                          |
| --------------------------- | ------------------------------------------------ |
| `v_user_purchase_rollup`    | One row per user — total_orders, lifetime_spend  |
| `v_user_top_categories`     | One row per user × category — units_bought, spent |

See `db/migrations/20260516000001_init.js` for the exact column list.

---

## 5. API surface

### Auth (`/api/auth`)
| Method | Path           | Purpose                                |
| ------ | -------------- | -------------------------------------- |
| POST   | `/verify-otp`  | OTP login (demo OTP = `1234`)          |
| GET    | `/me`          | user + family + health                 |
| PUT    | `/me`          | update name / email / city / avatar    |
| GET    | `/family`      | list family members                    |
| POST   | `/family`      | add member                             |
| DELETE | `/family/:id`  | remove member                          |
| GET    | `/health`      | get health profile                     |
| PUT    | `/health`      | upsert health profile                  |

### Products (`/api/products`)
| Method | Path                  | Notes                              |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/`                   | `?category=Seeds&q=tomato&region=` |
| GET    | `/categories/list`    | string[] for filter chips          |
| GET    | `/categories`         | full category objects              |
| GET    | `/:id`                |                                    |
| POST/PUT/DELETE | `/:id`       | admin                              |

### Orders (`/api/orders`)
All write paths wrapped in a `db.transaction` — stock lock, line items,
payment record and reward points all commit atomically.

### Analytics (`/api/analytics`)
| Path                       | Powered by                                    |
| -------------------------- | --------------------------------------------- |
| `GET /me/insights`         | `v_user_purchase_rollup` + `v_user_top_categories` |
| `GET /me/recommendations`  | excludes already-purchased, prefers top category |
| `GET /health-segments?condition=diabetes` | join health profile × purchase rollup |
| `GET /top-products?days=30` | best-sellers in window                       |

---

## 6. Sample analytics queries

```sql
-- LTV per city
SELECT city, COUNT(*) AS buyers, SUM(lifetime_spend) AS revenue
FROM v_user_purchase_rollup
GROUP BY city ORDER BY revenue DESC;

-- Buyers with hypertension AND who spend > ₹1000
SELECT r.name, r.lifetime_spend
FROM v_user_purchase_rollup r
JOIN user_health_profile h ON h.user_id = r.user_id
WHERE 'hypertension' = ANY(h.conditions) AND r.lifetime_spend > 1000;

-- Products often bought together (basket analysis)
SELECT a.name_snapshot, b.name_snapshot, COUNT(*) AS co_occurrence
FROM order_items a
JOIN order_items b ON a.order_id = b.order_id AND a.product_id < b.product_id
GROUP BY a.name_snapshot, b.name_snapshot
ORDER BY co_occurrence DESC LIMIT 20;
```

---

## 7. Adding a new feature (cheat-sheet)

1. Write a Knex migration:
   ```bash
   npx knex migrate:make add_my_feature
   ```
2. Add table(s) in `exports.up` and reverse in `exports.down`.
3. Run `npm run db:migrate`.
4. Create a `routes/<feature>.js` file following the patterns in
   `routes/products.js` (read) or `routes/orders.js` (write w/ TX).
5. Wire it in `server.js` with `app.use('/api/<feature>', require('./routes/<feature>'))`.
6. Add JSON-key aliases (`snake_case → camelCase`) before responding.
7. Update this doc.

---

## 8. What was removed during migration

- All `models/*.js` Mongoose schemas (User, Order, Product, Plant,
  PlantTracking, CommunityPost, InstructorBooking, ProductUpdated)
- `data/seedProducts.js`, `data/productImages.js`, `data/geolocationData.json`
- `routes/geolocationWithJSON.js` (camelCase + tech-leak in name; was unused)
- `utils/loadGeolocationData.js`
- `mongoose` dependency from `package.json`

If you need the geolocation feature back, port it onto the new
`product_categories.region` column and the `products.region` column.
