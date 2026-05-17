// server.js – GrowFresh API (Postgres edition)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('./config/db'); // initializes pg pool + boot ping

const app = express();

// ─── security & infra middleware ───────────────────────────
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

const ALLOWED = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((s) => s.trim());
app.use(
  cors({
    origin: ALLOWED.includes('*') ? true : ALLOWED,
    credentials: true,
  })
);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// global rate-limit: 300 req / 15 min / IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// stricter limit for OTP endpoint
app.use(
  '/api/auth/verify-otp',
  rateLimit({ windowMs: 10 * 60 * 1000, max: 10 })
);

// ─── routes ────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/products',    require('./routes/products'));
app.use('/api/cart',        require('./routes/cart'));
app.use('/api/orders',      require('./routes/orders'));
app.use('/api/garden',      require('./routes/garden'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/community',   require('./routes/community'));
app.use('/api/analytics',   require('./routes/analytics'));
app.use('/api/activity',    require('./routes/activity'));
app.use('/api/family',      require('./routes/family'));
app.use('/api/wellness',    require('./routes/wellness'));

// liveness + readiness
app.get('/', (_req, res) => res.json({ name: 'growfresh-api', status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// fallback 404
app.use((req, res) => res.status(404).json({ msg: `Not found: ${req.method} ${req.path}` }));

// generic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('🔥', err);
  res.status(err.status || 500).json({ msg: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌱 GrowFresh API on :${PORT} (${process.env.NODE_ENV || 'development'})`));
