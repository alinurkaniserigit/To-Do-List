const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logsSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    operation:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Logs',logsSchema)
