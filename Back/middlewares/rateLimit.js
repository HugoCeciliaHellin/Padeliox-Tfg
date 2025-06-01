const rateLimit = require('express-rate-limit');
module.exports = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: process.env.NODE_ENV === 'production' ? 10000 : 100000,
  standardHeaders: true,
  legacyHeaders: false
});
