
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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

productSchema.plugin(mongoosePaginate);

module.exports =  mongoose.model("product",productSchema)