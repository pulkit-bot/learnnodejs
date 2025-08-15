const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = require('../models/userSchema');
const SECRET_KEY= "pulkit@123"
const blacklist = require('../models/blacklistSchema');


const auth = async (req,res,next)=>{

        try{

          const header = req.headers['authorization'];
            //    console.log("Authorization Header:", header);
        
               if (!header) {
            return res.status(401).json({ message: "Token not found" });
        }
                    // console.log("Header".header);
                    const bearer = header.split(" ");
                        // console.log("Bearer Array".bearer);

                    const token = bearer[1];

                    if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }


      const blacklist_token_exist =  await blacklist.findOne({_token:token});
    if(blacklist_token_exist)
    {
      return res.status(401).json({ message: "Session Expired" });
    }

                    // console.log("Token".token);
                    const user = jwt.verify(token,SECRET_KEY);

                    // console.log("Decoded User:".user);
                    user_info = user;
                    //req.token = user;
                    // console.log("reqtoken".req.token);


//                     console.log("Header:", header);
// console.log("Bearer Array:", bearer);
// console.log("Token:", token);
// console.log("Decoded User:", user);
                    return next();
           
          
        }catch(err){
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token" });
        } else {
            return res.status(500).json({ success: false, message: err.message });
        }

        }




}

module.exports = { auth };