
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

     name : { 
        type :  String,
        required : true
    },
    email:{
        type : String,
        required: true,
        unique: true,
    },
   status:{
        type : String,
        enum: ["active","inactive"],
        default: "active"
    },
    price: {
        type: Number,
        default: null
    },
     category: {
        type: String,
        required : true
    } , 
    gender: {
        type: String,
        required : true
    }  

})


module.exports =  mongoose.model("product",productSchema)