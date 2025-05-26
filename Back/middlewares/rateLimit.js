// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
module.exports = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100, // 100 peticiones por IP
  standardHeaders: true,
  legacyHeaders: false
});
