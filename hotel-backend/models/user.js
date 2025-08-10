const mongoose=require('mongoose');

const userschema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    middlename:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    profilePhoto:{
        type:String
    },
    wishlist: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        }
    ],      
    role:{
        type:String,
        enum: ["user", "admin"],
        default:"user",
    },
}, { timestamps: true });

module.exports = mongoose.model('User',userschema);