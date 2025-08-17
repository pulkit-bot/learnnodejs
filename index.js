const express = require("express");
const app= express();
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require("multer");
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");

const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const rateLimitMiddleware = require("./middleware/rateLimiter");

// ✅ Global (har route per lagana hai)
// app.use(rateLimitMiddleware);

// Redis connection banayenge (default port 6379 pe)
// const redisClient = new Redis({
//   host: "127.0.0.1",  // Redis server ka IP
//   port: 6379,         // Redis port
// });


// const limit = ratelimit({
//   windowMs: 1*60*1000,
//   max: 2,
//   message: { error: 'Too many requests, please try again later.' },
//   headers: true,
// });

// ===== Rate Limiter Config =====
// const rateLimiter = new RateLimiterRedis({
//   storeClient: redisClient,
//   keyPrefix: "middleware",   // Redis ke andar keys is prefix ke sath store hongi
//   points: 5,                 // 5 requests
//   duration: 60,              // 1 minute (60 sec) ke andar
// });

// app.use(helmet());
//app.use(limit);

// app.use(async (req, res, next) => {
//   try {
//     // IP based limit
//     await rateLimiter.consume(req.ip);

//     next(); // agar limit cross nahi hui toh next route pe jao
//   } catch (rejRes) {
//     // agar limit exceed ho gayi
//     res.status(429).json({
//       error: "Too many requests, please try again later.",
//       remainingPoints: rejRes.remainingPoints
//     });
//   }
// });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser.json())

const port = '3001';
const stu = require('./routes/home');
const User = require('./routes/user');
const { message } = require("./validators/productValidator");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wap');
    console.log(' MongoDB Connected...');
  } catch (err) {
    console.error(' MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};


connectDB();
app.set('views','./views')
app.set('view engine','ejs')

console.log("RUNNING FILE:", __filename);
app.use(express.static((__dirname, 'public')));



app.use('/',stu);
app.use('/user',User);

app.listen(port);