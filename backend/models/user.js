const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('../helpers/role');

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    groupNames:[{
        type:String
    }],
    listNames:[{
        type:String
    }],
    isAdmin:{
        type:Boolean,
        default: false
    }
})


module.exports = mongoose.model('User',userSchema);