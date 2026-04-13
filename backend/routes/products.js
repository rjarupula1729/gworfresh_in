const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { name: "Tomato Seeds", price: 59, oldPrice: 79, emoji: "🍅" },
    { name: "Chilli Seeds", price: 49, oldPrice: 65, emoji: "🌶️" },
    { name: "Coriander Seeds", price: 39, oldPrice: 55, emoji: "🌿" }
  ]);
});

module.exports = router;