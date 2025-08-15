const Product =  require('../models/productSchema');
const { body, validationResult } = require("express-validator");

const getallList = async (req,res)=>{
   
    try{
             const productList =  await Product.find();
             //console.log("Prodtc list",productList);
             res.render('index',{product: productList});
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



module.exports = {getallList,storelist,createlist,deletelist,editlist,updatelist}