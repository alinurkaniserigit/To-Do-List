const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blocklistSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
})


module.exports = mongoose.model('BlockList',blocklistSchema);