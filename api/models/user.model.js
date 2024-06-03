const mongoose = require('mongoose');
const Schema=mongoose.Schema;


// Create a schema:
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:8,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true});

// Create a model:
const User=mongoose.model('User',userSchema)

// Export the model:
module.exports=User;