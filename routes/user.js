 const express = require('express');

 const router =  express.Router();

const { auth } = require('../middleware/auth');
const rateLimiter = require("../middleware/rateLimiter");

 const { register,login,profile,refresh_token,logout} = require('../controllers/userController');

 router.post("/register",register)

 router.post("/login",login)

//  router.get("/profile",auth,rateLimiter,profile) -> rate limiter using redis rate-limit-flexible

 router.get("/profile",auth,profile)

 router.get("/refresh-token",auth,refresh_token)

 router.get('/logout',auth,logout);




 module.exports = router;