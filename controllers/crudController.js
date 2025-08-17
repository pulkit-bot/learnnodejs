const Product =  require('../models/productSchema');
const { body, validationResult } = require("express-validator");

const multer = require("multer");
const path = require("path");
const nodemail = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dfy15assu",
  api_key: "187187748955255",
  api_secret: "hrT5mp_y31gnUOYFRfHKKW1IpK8",
});


   const transport = nodemail.createTransport({
        
       host : 'sandbox.smtp.mailtrap.io',
       port:2525,
       auth: {
         user: "91501c34a56630",
         pass: "882fc652862184"
      } 
   })

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder jaha file save hogi
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (optional - sirf images allow karne ke liye)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
    fileFilter: fileFilter
}).single("file");

// Single file upload


const getallList = async (req,res)=>{
   
    try{

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2
        const skip = (page-1)*limit;
        
        const total =  await Product.countDocuments();

        const products =  await Product.find().select("name email status category").skip(skip).limit(limit);

        // total pages
const totalPages = Math.ceil(total / limit);
const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

// build next / prev URLs
const nextPage = page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;


         res.json({
            totalRecords: total,
  page,
  limit,
  totalPages,
  nextPage,
  prevPage,
  data: products
         });

   //    let page = parseInt(req.query.page) || 1;
   //  let limit = 2; // posts per page

   //  const options = {
   //    page,
   //    limit,
   //    sort: { createdAt: -1 },
   //  };

   //           const productList =  await Product.paginate({}, options);
   //           //console.log("Prodtc list",productList);
   //           res.render('index',{
   //             product: productList.docs,
   //             currentPage: productList.page,
   //             totalPages: productList.totalPages,
   //             hasNextPage: productList.hasNextPage,
   //             hasPrevPage: productList.hasPrevPage,
   //             nextPage: productList.nextPage,
   //             prevPage: productList.prevPage,
   //             });
    }catch(error){
     console.log(error);
 
    }
}

const storelist = async (req,res)=>{
   //console.log(req.body);
   try{
         await Product.create({
            name : req.body.name,
           email: req.body.email,
           price: req.body.price,
           category: req.body.category,
           gender: req.body.gender
         });
         res.redirect("/");
   //  res.send("Create Succesfully");
   }
   catch(err)
   {
      if (err.code === 11000 && err.keyPattern.email) {
      return res.render("create", {
        errors: [{ msg: "Email already exists" }],
        old: req.body,
        categories: ["Electronics", "Clothing", "Books"],
        genders: ["Male", "Female"]
      });
    }
    res.status(500).send(err.message);
      // res.send(err)
   }
 
}
const createlist = (req,res)=>{
   const category =  ["Electronics", "Clothing", "Books"]; 
   res.render('create',{errors: [], old: {}, categories : category});
}
const editlist = async (req,res)=>{
   //res.render('edit');
   //console.log(req.params.id);
  const productdata = await Product.findOne({ _id: req.params.id});
  const categories = ["Electronics", "Clothing", "Books"];
const genders = ["Male", "Female"];
 // console.log(productdata);
   res.render('edit', { product: productdata ,categories,genders});
   
}

const deletelist = async (req,res)=>{
    console.log(req.params.id)
    //await Product.findByIdAndDelete(req.params.id);
    await Product.deleteOne({ _id: req.params.id });
  res.redirect("/");
   
}


const updatelist = async (req,res)=>{
   //res.render('edit');
   //console.log(req.params.id);
   try{
const productdata = await Product.updateOne(
   { _id: req.params.id},
   {
        $set: {
          name: req.body.name,
          email: req.body.email,
          price: req.body.price,
          category: req.body.category,
          gender: req.body.gender
        }
      }
   );

   res.redirect('/');
   }catch(updateerr)
   {
     console.error(error);
    res.status(500).send("Update failed");
   }
  
   
}



const uploadFile =  (req, res) => {
  upload  (req, res, async  function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

            //const uploadImage = await cloudinary.uploader.upload(req.file.path);

    
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "buyer", // 👈 yahan aap folder name de sakte ho
        use_filename: true,
        unique_filename: false,
      });

      // Delete file from local server after upload
   //  fs.unlinkSync(req.file.path);

      //   const newProduct = Product.create({
      //       name,
      //       price,
      //       category,
      //       image_name: req.file.filename,  // ✅ file name store
      //       image_url: baseUrl + req.file.filename,  // ✅ URL store
      //       image : uploadImage, // image uplaod cloudinary
      //       // image_url: result.secure_url,       // 👈 Cloudinary se URL
      //       //   public_id: result.public_id, 

      //    });
        res.json({
            success: true,
            message: "File uploaded successfully",
            file: {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                result
               //  uplaod : uploadImage
            }
        });
    });
};


const sendMail = async(req,res) =>{


      try{

         const info = await transport.sendMail({
                  from:"pulkit@mobitrade.in",
                  to:"pulkit06@gmail.com",
                  subject: "Mail Subject",
                  text:"Keerti ...."


      })
      res.json({msg:"email sent succefully" , data:info});
      }
      catch(err){
         res.json({msg:"email not sent" , error:err.message});
      }
}

module.exports = {getallList,storelist,createlist,deletelist,editlist,updatelist,uploadFile,sendMail}