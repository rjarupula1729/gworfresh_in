require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/garden', require('./routes/garden'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/community', require('./routes/community'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});