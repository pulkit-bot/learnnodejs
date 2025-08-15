 const express = require('express');

 const router =  express.Router();

const { auth } = require('../middleware/auth');

 const { register,login,profile,refresh_token} = require('../controllers/userController');

 router.post("/register",register)

 router.post("/login",login)

 router.get("/profile",auth,profile)

 router.get("/refresh-token",auth,refresh_token)




 module.exports = router;