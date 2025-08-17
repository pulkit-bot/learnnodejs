const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");

// Redis client
// const redisClient = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
// });

// const rateLimiter = new RateLimiterRedis({
//   storeClient: redisClient,
//   keyPrefix: "middleware",
//   points: 5,       // kitne request allow (5 requests)
//   duration: 60,    // time window (per 60 sec)
// });

// Middleware
// const rateLimiterMiddleware = (req, res, next) => {
//   const key = req.user ? req.user.id : req.ip; // user.id based ya IP based

//   rateLimiter.consume(key)
//     .then(() => {
//       next();
//     })
//     .catch(() => {
//       res.status(429).json({ error: "Too many requests, try again later." });
//     });
// };

//module.exports = rateLimiterMiddleware;


//  ................................................................


// const { RateLimiterRedis } = require("rate-limiter-flexible");
// const Redis = require("ioredis");

// const redisClient = new Redis({
//   host: "127.0.0.1",
//   port: 6379
// });

// // User-based limiter (JWT user ke liye)
// const userRateLimiter = new RateLimiterRedis({
//   storeClient: redisClient,
//   keyPrefix: "user_limit",
//   points: 10, // 10 requests
//   duration: 60 // per 1 minute
// });

// // IP-based limiter (login, signup ke liye)
// const ipRateLimiter = new RateLimiterRedis({
//   storeClient: redisClient,
//   keyPrefix: "ip_limit",
//   points: 5, // 5 requests
//   duration: 60 // per 1 minute
// });

// // Middleware
// const rateLimitMiddleware = async (req, res, next) => {
//   try {
//     if (user_info) {   //auth middleware se user_info
//       // JWT user based
//       await userRateLimiter.consume(req.user.id);
//     } else {
//       // IP based
//       await ipRateLimiter.consume(req.ip);
//     }
//     next();
//   } catch (err) {
//     return res.status(429).json({ message: "Too many requests, slow down!" });
//   }
// };

// module.exports = rateLimitMiddleware;

