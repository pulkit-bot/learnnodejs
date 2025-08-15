const User =  require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = require('../models/userSchema');
const { message } = require('../validators/productValidator');
const SECRET_KEY= "pulkit@123";
const blacklist = require('../models/blacklistSchema');

const register = async (req,res)=>{
   //console.log(req.body);
   try{
        const email =  req.body.email;
       const username =  req.body.username;
       const pwd =   req.body.password;

   const hashpassword = await bcrypt.hash(pwd,10);

       const userCreated = await User.create({
         email : email,
         username : username,
         password : hashpassword
       })

        res.status(201).json({ success: true, message: "User created successfully",data: userCreated });
   }
   catch(err)
   {
      if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: `Duplicate value for ${Object.keys(err.keyValue)}: ${Object.values(err.keyValue)}`,
        field: err.keyValue
      });
    }
    res.status(500).json({success: false, message : err.message});
      // res.send(err)
   }
 
}

const login = async (req,res) => {
        
        
    if (req.body.email && req.body.password) {


        try{
            //console.log(req.body);
                    const user =  await User.findOne({ email : req.body.email});
            //console.log(user);
                        if (user) {
                               // console.log("if");
                        const IsMatch =  bcrypt.compare(req.body.password,user.password);
                            if (IsMatch) {
                                    //console.log("IsMatch");
                                const token = jwt.sign({
                                    user_id : user.id,
                                    user_name : user.username,
                                    user_email : user.email
                                },SECRET_KEY,{expiresIn:'1m'})

                                const refresh_token = jwt.sign({
                                    user_id : user.id,
                                    user_name : user.username,
                                    user_email : user.email
                                },SECRET_KEY,{expiresIn : '10m'})
                                //res.json(token);
                                res.status(200).json({success: true,message: "login successfully",data: {user,token,refresh_token}})
                            } else {
                                res.status(401).json({success: false,message: "Password not Match !! please fill Correct password"})
                            }
                            
                        } else {
                        res.status(401).json({success: false,message: "User not found"}) 
                        }
        }catch(err)
        {
           res.status(500).json({success: false,message: err.message}) 
        }
      
             


    }else{
         res.status(500).json({success: false,message: "Please fill Username & Password"})
    }
    

}


const profile = async (req, res) => {
    try {
        

        if (!user_info) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: { user_info }
        });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


const refresh_token = (req,res) =>{

    //    console.log("Refresh token api callling");
    
    const header = req.headers['authorization'];

    try{

       if (!header) {
            return res.status(401).json({ success: false, message: "Refresh token not found" });
        }

        const bearer = header.split(" ");
        const refreshToken = bearer[1];


        
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token missing" });
        }

        jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
            }
             console.log(user);
            // Naya access token banao
            const newAccessToken = jwt.sign({
                id: user.user_id,
                username: user.user_name,
                email: user.user_email
            }, SECRET_KEY, { expiresIn: "1m" });

            return res.status(200).json({
                success: true,
                message: "New access token generated",
                accessToken: newAccessToken
            });
        });

    }catch(error)
    {
        return res.status(400).json({ success: false, message: error.message });
    }

}


 const logout =  async (req,res) => {

const header = req.headers['authorization'];
    try{

         if (!header) {
            return res.status(401).json({ success: false, message: "Refresh token not found" });
        }

        const bearer = header.split(" ");
        const logouttoken = bearer[1];

          const logoutblacklist = await blacklist.create({
              _token : logouttoken
            })
    
            res.setHeader('Clear-Site-Data', '"cookies", "storage", "cache"');

           res.status(200).json({ sucess:true,message: 'Logged out successfully and site data cleared.' });
          
    }catch(err)
    {
       return res.status(400).json({ success: false, message: error.message }); 
    }
 }

module.exports = {register,login,profile,refresh_token,logout}