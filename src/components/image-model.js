const mongoose = require("mongoose");
const uploadSchema=new mongoose.Schema({
title:{
type:String,
unique:true,

},
content:String,
imageName:[]
});
const uploadModel=mongoose.model("image",uploadSchema);
module.exports=uploadModel;
