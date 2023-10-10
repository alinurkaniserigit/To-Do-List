const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Role = require('../helpers/role');

const loginTokenSchema = new Schema({
    userID:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
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

module.exports = mongoose.model('Token',loginTokenSchema);
