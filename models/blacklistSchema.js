const mongoose =  require("mongoose");

const blacklistSchema = new mongoose.Schema({
   _token : {
    type: String,
    reuqired:true
   }
},{
    timestamps: true
});


module.exports = mongoose.model("blacklist",blacklistSchema);